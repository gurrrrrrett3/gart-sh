// type: gsh command

import gshConsole from "../../modules/console";
import ShortLinkManager from "../../modules/links";
import GlobalUtils from "../../modules/util/globalUtils";

const link = {
  name: "link",
  desc: "Create a short link",
  args: [
    {
      name: "link",
      desc: "The destination of the link",
      type: "string",
      required: true,
    },
  ],
  options: [
    {
      name: "noembed",
      desc: "Prevent link from being embedded",
    },
  ],
  run: async (self: gshConsole, args: string[]) => {
    const link = args[0];
    if (!link) {
      return "link: missing operand";
    }

    const options = GlobalUtils.formatOptions(args.slice(1));
    const key = await ShortLinkManager.createLink(link, options);

    if (key.error) {
      return `link: ${key.error}`;
    }

    return `Link created! <a href="https://gart.sh/${key.key}">https://gart.sh/${key.key}</a> | <button onclick="navigator.clipboard.writeText('https://gart.sh/${key.key}')" >Copy</button>`;
  },
};

export default link;
