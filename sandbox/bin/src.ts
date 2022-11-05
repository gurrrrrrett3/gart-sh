// type: gsh command
import gshConsole from "../../modules/console";

const src = {
    name: 'src',
    desc: "Show the source code ",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        self.openLink("https://github.com/gurrrrrrett3/gart-sh")
        return "Opening source code...";
    }
}

export default src