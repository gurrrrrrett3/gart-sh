// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const cat = {
    name: 'cat',
    desc: "Open a file and print it's contents to the console",
    args: [
        {
            name: 'file',
            desc: 'The file to open',
            type: 'string',
            required: true
        }
    ],
    run: async (self: gshConsole, args: string[]) => {
        const path = PathUtils.resolve(self.location + args[0])
        if (!existsSync(path) || !statSync(path).isFile()) 
            return `cat: ${args[0]}: No such file or directory`
        const file = readFileSync(path, 'utf8');
        return file;
    }
}

export default cat