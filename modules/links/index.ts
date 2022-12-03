import { db } from "../..";
export default class ShortLinkManager {
  public static links = new Map<
    string,
    {
      url: string;
      options: { [key: string]: string | boolean | number };
    }
  >();

  public static async init() {
    const links = await db.link.findMany();
    links.forEach((link) => {
      this.links.set(link.key, {
        url: link.url,
        options: link.options ? JSON.parse(link.options) : {},
      });
    });
  }

  static async createLink(url: string, options?: { [key: string]: string | boolean | number }) {
    const key = options?.key && typeof options.key == "string" ? options.key as string : await this.generateKey();

    if (await db.link.findUnique({ where: { key } })) {
      return {
        error: "Key already exists",
      }
    }

    // save link to database
    await db.link.create({
      data: {
        url,
        key,
        options: options ? JSON.stringify(options) : undefined,
      },
    });

    return {
      key,
    }
  }

  static async generateKey(): Promise<string> {
    // generate a random key that is not already in use (6 characters)
    const key = Math.random().toString(36).substring(2, 8);
    if (await db.link.findUnique({ where: { key } })) {
      return await this.generateKey();
    }
    return key;
  }

  static async getLink(key: string, urlOnly: true): Promise<string | undefined>;
  static async getLink(
    key: string,
    urlOnly?: false
  ): Promise<{ url: string; options: { [key: string]: string | boolean | number } } | string | undefined>;
  static async getLink(
    key: string,
    urlOnly = false
  ): Promise<{ url: string; options: { [key: string]: string | boolean | number } } | string | undefined> {
    if (this.links.has(key)) {
      await db.link.update({
        where: {
          key,
        },
        data: {
          uses: {
            increment: 1,
          },
          lastUsedAt: new Date(),
        },
      });

      await this.updateLink(key);
      return this.links.get(key)?.url;
    } else {
      const link = await db.link.findUnique({
        where: {
          key,
        },
      });
      if (link) {
        this.links.set(key, {
          url: link.url,
          options: link.options ? JSON.parse(link.options) : {},
        });
        await this.updateLink(key);
        return urlOnly ? link.url : this.links.get(key);
      } else return undefined;
    }
  }

  static async getStats(key: string) {
    if (await db.link.findUnique({ where: { key } })) {
      const link = await db.link.findUnique({
        where: {
          key,
        },
      });

      return link;
    } else return undefined;
  }

  static async updateLink(key: string) {
    if (await db.link.findUnique({ where: { key } })) {
      await db.link.update({
        where: {
          key,
        },
        data: {
          uses: {
            increment: 1,
          },
          lastUsedAt: new Date(),
        },
      });
    } else return undefined;
  }

  static async logIp(key: string, ip: string) {
    if (await db.link.findUnique({ where: { key } })) {
      await db.ip.create({
        data: {
          ip,
          Link: {
            connect: {
              key,
            },
          },
        },
      });
    }
  }

  static async getIps(key: string) {
    if (await db.link.findUnique({ where: { key } })) {
      const ips = await db.ip.findMany({
        where: {
          Link: {
            key,
          },
        },
      });

      return ips;
    }
  }
}
