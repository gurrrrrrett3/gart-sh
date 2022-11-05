// type: gsh command

import { readdirSync, readFileSync, statSync } from "fs";
import gshConsole from "../../modules/console";
import PathUtils from "../../modules/util/pathUtils";

const ls = {
  name: "ls",
  desc: "List files in a directory",
  args: [
    {
      name: "location",
      desc: "The directory to list",
      type: "string",
      required: false,
    },
  ],
  run: async (self: gshConsole, args: string[]) => {
    const location = args[0] || self.location;
    const path = PathUtils.resolve(location);
    let files = readdirSync(path, "utf8");

    files = files.map((file) => {
      if (statSync(path + "/" + file).isDirectory()) {
        return file + "/";
      }

      const fileData = readFileSync(`${path}/${file}`, "utf8");
      if (fileData.split("\n")[0] == "// type: gsh command") {
        return file.replace(/(\.ts)|(\.js)/gi, "");
      }

      if (file.includes(" ")) {
        return `"${file}"`;
      }

      return file;
    });

    return files.join(" ")
  },
};

export default ls
