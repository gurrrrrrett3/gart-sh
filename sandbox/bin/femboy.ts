// type: gsh command

import gshConsole from "../../modules/console";

const femboy = {
    name: 'femboy',
    desc: "Shows a femboy",
    hidden: true,
    args: [
        {
            name: 'file',
            desc: 'The file to open',
            type: 'string',
            required: true,
        }
    ],
    run: async (self: gshConsole, args: string[]) => {
       self.openLink("https://gart.sh/x7x39w")
    }
}

export default femboy