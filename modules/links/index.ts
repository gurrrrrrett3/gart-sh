import { db } from "../..";

export default class ShortLinkManager {
  static links: {
    [key: string]: string;
  } = {};

  static async init() {
    // load links from database

    db.link.findMany().then((links) => {
      links.forEach((link) => {
        this.links[link.key] = link.url;
      });
    });
  }

  static async createLink(url: string) {
    const key = this.generateKey();
    this.links[key] = url;

    // save link to database
    await db.link.create({
      data: {
        url,
        key,
      },
    });

    return key;
  }

  static generateKey(): string {
    // generate a random key that is not already in use (6 characters)
    const key = Math.random().toString(36).substring(2, 8);
    if (this.links.hasOwnProperty(key)) {
      return this.generateKey();
    }
    return key;
  }

  static getLink(key: string) {
    if (this.links.hasOwnProperty(key)) {
      // update link in database
      db.link.update({
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

      return this.links[key];
    } else return undefined;
  }

  static async getStats(key: string) {
    if (this.links.hasOwnProperty(key)) {
      const link = await db.link.findUnique({
        where: {
          key,
        },
      });

      return link;
    } else return undefined;
  }
}
