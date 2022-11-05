// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const cd = {
    name: 'cd',
    desc: "Change the current directory",
    args: [
        {
            name: 'location',
            desc: 'The directory to change to',
            type: 'string',
            required: true
        }
    ],
    run: async (self: gshConsole, args: string[]) => {
        const path = PathUtils.resolve(self.location + args[0])
        console.log(path)
        if (!existsSync(path) || !statSync(path).isDirectory()) 
            return `cd: ${args[0]}: No such directory`
        if (!path.includes("/sandbox"))
            return `cd: ${args[0]}: Permission denied`
        self.setLocation(PathUtils.toSandbox(path) + "/")

        return " "
    }
}

export default cd