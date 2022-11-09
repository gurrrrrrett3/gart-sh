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
      const c = require(path.resolve(`./dist/sandbox/bin/${command}.js`)).default;

      let help = [
        `<span class="green">Command:</span> ${c.name}`,
        `<span class="green">Description:</span> ${c.desc}`,
        `<span class="green">Usage:</span> ${c.name} ${c.args.map((arg: any) => arg.name).join(" ")}`,
        `<span class="green">Arguments:</span>`,
        `<ul>${c.args.map((arg: any) => `<li><span class="green">${arg.name}:</span> ${arg.desc}</li>`).join("")}</ul>`,
        `<span class="green">Options:</span>`,
        // `<ul>${c.options.map((option: any) => `<li><span class="green">-${option.name}:</span><span class="cyan">${option.alias ? ` (Alias: -${option.alias})` : ""}</span> ${option.desc}</li>`).join("")}</ul>`,
        `<ul>${c.options.map((option: any) => `<li><span class="green">--${option.name}:</span> ${option.desc}</li>`).join("")}</ul>`,
      ].join("<br>");

      return help;
    } else {
      const files = readdirSync(path.resolve("./dist/sandbox/bin"), "utf8");
      return files.map((file: string) => {
        const c = require(path.resolve(`./dist/sandbox/bin/${file}`)).default;
        if (c.hidden) return "undefined";
        return `${c.name} - ${c.desc}`;
      }).filter((file: string) => file != "undefined")
    }
  },
};

export default help;
