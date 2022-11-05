// type: gsh command

import { readdirSync } from "fs";
import gshConsole from "../../modules/console";
import path from "path";

const help = {
  name: "help",
  desc: "Display help",
  args: [
    {
      name: "command",
      desc: "Command to get help for",
      type: "string",
      required: false,
    },
  ],
  run: async (self: gshConsole, args: string[]) => {
    if (args[0]) {
      const command = args[0];
      const c = require(`./dist/sandbox/bin/${command}.js`).default;

      let help = [
        `Command: ${c.name}`,
        `Description: ${c.desc}`,
        `Usage: ${c.name} ${c.args.map((arg: any) => arg.name).join(" ")}`,
      ].join("\n");

      return help;
    } else {
      const files = readdirSync(path.resolve("./dist/sandbox/bin"), "utf8");
      return files.map((file: string) => {
        const c = require(path.resolve(`./dist/sandbox/bin/${file}`)).default;
        return `${c.name} - ${c.desc}`;
      });
    }
  },
};

export default help;
