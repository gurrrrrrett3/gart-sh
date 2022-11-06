// type: gsh command

import gshConsole from "../../modules/console";

const clear = {
    name: 'clear',
    desc: "Clear the console",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        self.clear()
        return 
    }
}

export default clear