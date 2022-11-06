// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const auth = {
    name: 'auth',
    desc: "Open a file and print it's contents to the console",
    args: [
        {
            name: 'command',
            desc: 'The command to run',
            type: 'login | logout | status',
            required: true
        }
    ],
    run: async (self: gshConsole, args: string[]) => {
        const command: "login" | "logout" | "status" = args[0] as any;
        if (command === "login") {
            self.openLink("/auth/login")
        }
    }
}

export default auth