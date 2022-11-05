// type: gsh command

import gshConsole from "../../modules/console";
import ShortLinkManager from "../../modules/links";

const link = {
    name: 'link',
    desc: "Create a short link",
    args: [
        {
            name: 'link',
            desc: 'The destination of the link',
            type: 'string',
            required: true
        }
    ],
    run: async (self: gshConsole, args: string[]) => {
        const link = args[0]
        if (!link) {
            return "link: missing operand"
        }

        const key = await ShortLinkManager.createLink(link)
        navigator.clipboard.writeText(`https://gart.sh/${key}`);
        return `Link created! <a href="https://gart.sh/${key}">https://gart.sh/${key}</a> | Copied to clipboard!`
    }
}

export default link