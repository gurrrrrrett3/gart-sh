// type: gsh command

import gshConsole from "../../modules/console";

const pwd = {
    name: 'pwd',
    desc: "Print the current directory",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        return self.location
    }
}

export default pwd