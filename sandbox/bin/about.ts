// type: gsh command

import gshConsole from "../../modules/console";

const about = {
  name: "about",
  desc: "About me",
  args: [],
  run: async (self: gshConsole, args: string[]) => {
    return [
        "<h1 class=\"green\">Hey! o/</h1>",
        "<p>I'm Gart, a 20 year old backend application developer. ",
        "Most of my projects are in <span style=\"color: #2f74c0;\">TypeScript</span>.<br>",
        "Currently working on <a href=\"https://gart.sh\">gart.sh</a>, my personal website and sandbox.</p>",
        "Check out my <a href=\"https://github.com/gurrrrrrett3\">GitHub</a>!",
    ].join("")
  },
};

export default about;
