// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const auth = {
    name: 'auth',
    desc: "Authenticate with the server",
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
        } else if (command === "logout") {
            self.request("/auth/logout", "GET")
        }   else if (command === "status") {
           self.request("/auth/status")
        }
    }
}

export default auth