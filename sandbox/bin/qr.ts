// type: gsh command

import gshConsole from "../../modules/console";
import qrcode, { QRCodeErrorCorrectionLevel, QRCodeMaskPattern } from "qrcode";
import GlobalUtils from "../../modules/util/globalUtils";
import ShortLinkManager from "../../modules/links";

const qr = {
  name: "qr",
  desc: "Generate a QR code",
  args: [
    {
      name: "url",
      desc: "The data to encode",
      type: "string",
      required: true,
    },
  ],
  options: [
    {
      name: "shortlink",
      desc: "Generate a gart.sh shortlink and use that for the QR code",
      alias: "S",
    },
    {
      name: "size",
      desc: "The size of the QR code (default: 512)",
      alias: "s",
    },
    {
      name: "margin",
      desc: "The margin of the QR code (default: 0.5)",
      alias: "m",
    },
    {
      name: "color",
      desc: "The color of the QR code (default: #000000)",
      alias: "c",
    },
    {
      name: "errorCorrection",
      desc: "The error correction level of the QR code (default: M), can be L, M, Q, or H",
      alias: "e",
    },
    {
      name: "mask",
      desc: "The mask of the QR code (default: undefined), can be 0-7",
      alias: "M",
    },
    {
      name: "version",
      desc: "The version of the QR code (default: undefined), can be 1-40",
      alias: "v",
    },
  ],
  run: async (self: gshConsole, args: string[]) => {
    const options = GlobalUtils.formatOptions(args.slice(1));
    const data = options.shortlink
      ? `https://gart.sh/${await ShortLinkManager.createLink(args[0])}`
      : args[0];

    const code = qrcode.create(data, {
      version: options.version ? (options.version as number) : undefined,
      errorCorrectionLevel: (options.errorCorrection as QRCodeErrorCorrectionLevel) || "M",
      maskPattern: (options.mask as QRCodeMaskPattern) || undefined,
    });

    const out = await qrcode.toDataURL(code.segments, {
      margin: options.margin ? (options.margin as number) : 0.5,
      width: options.size ? (options.size as number) : 512,
      color: {
        dark: options.color ? (options.color as string) : "#000000",
        light: "#FFFFFF",
      },
      type: "image/png",
    });
    if (options.shortlink) {
      return `QR Code created! Linked to ${data}<br><img src="${out}"/>`;
    } else {
      return `QR Code created! <br><img src="${out}"/>`;
    }
  },
};

export default qr;
