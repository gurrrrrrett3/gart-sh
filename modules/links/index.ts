import { db } from "../..";

export default class ShortLinkManager {
  static async createLink(url: string, options?: { [key: string]: string | boolean | number }) {
    const key = await this.generateKey();
    // save link to database
    await db.link.create({
      data: {
        url,
        key,
        options: options ? JSON.stringify(options) : undefined,
      },
    });

    return key;
  }

  static async generateKey(): Promise<string> {
    // generate a random key that is not already in use (6 characters)
    const key = Math.random().toString(36).substring(2, 8);
    if (await db.link.findUnique({ where: { key } })) {
      return await this.generateKey();
    }
    return key;
  }

  static async getLink(key: string) {
    const link = await db.link.findUnique({
      where: {
        key,
      },
    });
    if (link) {
      // update link in database
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

      if (link.options) {
        return {
          url: link.url,
          options: JSON.parse(link.options),
        };
      }

      return link.url;
    } else return undefined;
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
}
