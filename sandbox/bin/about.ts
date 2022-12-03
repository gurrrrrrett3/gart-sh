// type: gsh command

import gshConsole from "../../modules/console";

const about = {
  name: "about",
  desc: "About me",
  args: [],
  run: async (self: gshConsole, args: string[]) => {
    return [
        "<h1 class=\"green\">Hey! o/</h1>",
        "<p>I'm Gart, a 19 year old backend application developer.",
        "Most of my projects are in <span style=\"color: #2f74c0;\">TypeScript</span>, <span style=\"color: #dea584\">Rust</span>, and <span style=\"color: #f0931c;\">Java</span>.<br>",
        "Currently working on <a href=\"https://gart.sh\">gart.sh</a>, my personal website and sandbox.</p>",
        "I'm currently a developer at <a href=\"https://craftyourtown.com\" style=\"color: #0d85d8\">CraftYourTown</a>. ",
        "Check out my <a href=\"https://github.com/gurrrrrrett3\">GitHub</a>!",
    ].join("")
  },
};

export default about;
