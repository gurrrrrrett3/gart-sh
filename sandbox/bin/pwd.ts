// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const pwd = {
    name: 'pwd',
    desc: "Print the current directory",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        return self.location
    }
}

export default pwd