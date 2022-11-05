import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../../modules/types";

export default class gshTerminal {
  public commands: string[] = [];
  public commandIndex: number = 0;
  public instanceLog: string[] = [];
  public scrollLocation: number = 0;
  public location: string = "/home/gart";
  public user = "gart";
  public ver = "0.0.1";
  public cursor = '<span class="cursor" id="cursor">_</span>';
  public cursorLocation = 0;
  public id = "";

  constructor(public socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    socket.on("id", (id) => {
      if (this.id == "") {
        this.id = id;

        this.init();
      } else {
        this.id = id;
        this.log('<span class="red">Error: lost connection, id reassigned</span><br>');
        this.log(this.getPrompt());
        if (this.instanceLog[0].startsWith("gart.sh")) {
          this.instanceLog[0] = `gart.sh ${this.ver} | id: <span class="yellow">${this.id}</span>`;

          this.update();
        }
      }
    });

    socket.on("log", (message) => {
      this.log(message);
    });
    socket.on("openLink", this.openLink);
    socket.on("clear", () => {
      this.clear();
    });
    socket.on("location", (location) => {
      this.location = location;
    })
  }

  public init() {
    this.instanceLog.push(`gart.sh ${this.ver} | id: <span class="yellow">${this.id}</span>`);
    this.instanceLog.push(
      [
        "",
        '<a href="https://github.com/gurrrrrrett3">@gurrrrrrett3</a> 2022',
        "Type 'help' for a list of commands",
        "",
      ].join("<br>")
    );

    this.update();

    setTimeout(() => {
      this.instanceLog.push(this.getPrompt());
      this.update();
    }, 1000);
  }

  public update() {
    const terminal = document.getElementById("terminal");
    if (terminal && this.cursorLocation === 0) {
      terminal.innerHTML = this.instanceLog.join("<br>") + this.cursor;
    } else if (terminal && this.cursorLocation < 0) {
      // underline the char of line length + cursorLocation
      const line = this.instanceLog[this.instanceLog.length - 1];
      const lineLength = line.length;
      const cursorLocation = lineLength + this.cursorLocation;
      const lineBeforeCursor = line.slice(0, cursorLocation);
      const lineAfterCursor = line.slice(cursorLocation + 1, lineLength);
      const cursor = line[cursorLocation] === " " ? "_" : line[cursorLocation];
      terminal.innerHTML =
        this.instanceLog.slice(0, this.instanceLog.length - 1).join("<br>") +
        "<br>" +
        lineBeforeCursor +
        '<span class="cursor">' +
        cursor +
        "</span>" +
        lineAfterCursor;
    }
  }

  public log(...message: string[]) {
    this.instanceLog.push(...message);
    this.update();
  }

  public openLink(link: string) {
    window.open(link, "_blank");
  }

  public getPrompt() {
    return `${this.user}@gart.sh ${this.location === `/home/${this.user}` ? "~" : this.location == "/" ? "/" : this.location.split("/").at(-2)} $ `;
  }

  public setCurrentInput(input: string) {
    this.instanceLog[this.instanceLog.length - 1] = `${this.getPrompt()}${input}`;
    this.update();
  }

  public run(input: string) {
    if (input === "") {
      this.instanceLog.push(this.getPrompt());
      this.update();
      return;
    }

    this.commands.unshift(input);

    this.socket.emit("run", input, (res) => {
      console.log(res);
      if (res) {
        if (typeof res === "string") {
          this.log(res);
        } else {
          this.log(res.join("<br>"));
        }
        this.log(this.getPrompt());
      }
    });
  }

  public clear() {
    this.instanceLog = [this.getPrompt()];
    this.update();
  }

  public getPreviousCommand() {
    if (this.commandIndex < this.commands.length) {
      this.commandIndex--;
      this.setCurrentInput(this.commands[this.commandIndex - 1]);

      return this.commands[this.commandIndex - 1] == undefined ? "" : this.commands[this.commandIndex - 1];
    }

    return "";
  }

  public getNextCommand() {
    if (this.commandIndex > 0) {
      this.commandIndex++;
      this.setCurrentInput(this.commands[this.commandIndex - 1]);

      return this.commands[this.commandIndex - 1] == undefined ? "" : this.commands[this.commandIndex - 1];
    }

    return "";
  }
  
}
