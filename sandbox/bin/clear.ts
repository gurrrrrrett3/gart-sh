// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

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