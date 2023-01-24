// type: gsh command

import { readFileSync, existsSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const uwu = {
    name: 'uwu',
    desc: "uwu",
    args: [],
    hidden: true,
    run: async (self: gshConsole, args: string[]) => {
       self.openLink("https://reddit.com/r/hentai")
    }
}

export default uwu