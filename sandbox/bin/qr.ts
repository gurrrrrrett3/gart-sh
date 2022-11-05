// type: gsh command

import gshConsole from "../../modules/console";
import qrcode from "qrcode";
import GlobalUtils from "../../modules/util/globalUtils";
import ShortLinkManager from "../../modules/links";

const qr = {
  name: "qr",
  desc: "Generate a QR code",
  args: [
    {
      name: "string",
      desc: "The data to encode",
      type: "string",
      required: true,
    },
  ],
  options: [
    {
      name: "shortlink",
      desc: "Generate a gart.sh shortlink and use that for the QR code",
    },
    {
      name: "size",
      desc: "The size of the QR code (default: 512)",
    },
    {
      name: "margin",
      desc: "The margin of the QR code (default: 0.5)",
    },
  ],
  run: async (self: gshConsole, args: string[]) => {
    const options = GlobalUtils.formatOptions(args.slice(1));
    const data = options.shortlink
      ? `https://gart.sh/${await ShortLinkManager.createLink(args[0])}`
      : args[0];
    const out = await qrcode.toDataURL(data, {
      margin: (options.margin as number) || 0.5,
      width: (options.size as number) || 512,
    });
    if (options.shortlink) {
      return `QR Code created! Linked to ${data}<br><img src="${out}"/>`;
    } else {
      return `QR Code created! <br><img src="${out}"/>`;
    }
  },
};

export default qr;
