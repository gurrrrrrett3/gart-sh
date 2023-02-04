// type: gsh command

import gshConsole from "../../modules/console";
import ShortLinkManager from "../../modules/links";
import GlobalUtils from "../../modules/util/globalUtils";

const removelink = {
  name: "removelink",
  desc: "Remove a short link",
  hidden: true,
  args: [
    {
      name: "link",
      desc: "The ID of the link",
      type: "string",
      required: true,
    },
  ],
  options: [],
  run: async (self: gshConsole, args: string[]) => {
    const link = args[0];
    if (!link) {
      return "removelink: missing operand";
    }
    const key = await ShortLinkManager.deleteLink(link);

    if (!key) {
      return `removelink: Link not found`;
    }

    return `Link removed!`;
  },
};

export default removelink;
