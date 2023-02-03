// type: gsh command

import { readFileSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const motd = {
    name: 'motd',
    desc: "Get the message of the day",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        const path = PathUtils.resolve("/home/gart/motd.html")
        const file = readFileSync(path, 'utf8');
        return file;
    }
}

export default motd