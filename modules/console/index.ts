import fs from "fs";
import path from "path";
import { ClientToServerEvents, Command, InterServerEvents, ServerToClientEvents, SocketData } from "../types";
import { Socket } from "socket.io";
import { db } from "../..";

export default class gshConsole {
  public commands: string[] = [];
  public instanceLog: string[] = [];
  public location: string = "/home/gart/";
  public user: string = "gart";

  constructor(
    public socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  ) {
    socket.on("run", async (input, cb) => {
      console.log(input);
      const res = await this.run(input);
      cb(res);
    });

    socket.on("session", async (session) => {
      await db.sessionLink
        .findFirst({
          where: {
            id: session,
          },
        })
        .then(async (res) => {
          if (res) {
            const user = await db.token.findFirst({
              where: {
                id: res.userId,
              },
            }).User()


            if (user && user[0]) {
              this.user = user[0].username;
              this.socket.emit("user", this.user);
            }
          }
        });
    });
  }

  public async run(command: string) {
    const args = command.split(" ");
    const cmd = args.shift();

    if (!cmd) {
      return;
    }

    // check bin for command

    const commands = fs.readdirSync(path.resolve("./dist/sandbox/bin"));
    if (commands.map((v) => v.replace(".js", "")).includes(cmd)) {
      const command = require(path.resolve("./dist/sandbox/bin/" + cmd + ".js")).default as Command;
      const res = await command.run(this, args);
      return res;
    } else {
      this.log(`gsh: Command not found: ${cmd}`);
    }
  }

  public log(message: string) {
    this.socket.emit("log", message);
    console.log(message);
  }

  public openLink(link: string) {
    this.socket.emit("openLink", link);
  }

  public async clear() {
    this.socket.emit("clear");
  }

  public async setLocation(location: string) {
    this.socket.emit("location", location);
    this.location = location;
  }

  public request(path: string, method?: "GET" | "POST") {
    this.socket.emit("request", path, method);
  }
}
