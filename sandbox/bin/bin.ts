// type: gsh command

import gshConsole from "../../modules/console";

const cat = {
    name: 'bin',
    desc: "gartbin",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
       self.openLink("https://bin.gart.sh/")
    }
}

export default cat