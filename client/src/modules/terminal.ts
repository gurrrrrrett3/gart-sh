import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../../modules/types";
import "./secrets";
export default class gshTerminal {
  public commands: string[] = [];
  public commandIndex: number = 0;
  public instanceLog: string[] = [];
  public scrollLocation: number = 0;
  public location: string = "/home/gart";
  public user = "gart";
  public ver = "0.0.0";
  public cursor = '<span class="cursor" id="cursor">_</span>';
  public cursorLocation = 0;
  public screenLines = 0;
  public id = "";
  public isMobile = false;
  public enabled = true;
  public element: HTMLElement = document.getElementById("terminal") as HTMLElement;

  constructor(public socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    socket.on("id", (id, version) => {
      if (this.id == "") {
        this.id = id;
        this.ver = version;

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
    socket.on("user", (user) => {
      this.user = user;
      this.log(`<span class="green">Welcome back, ${user}!</span>`);
    });
    socket.on("request", async (url, method) => {
      this.log(
        await fetch(url, {
          method: method || "POST",
          body: method == "GET" ? undefined : JSON.stringify({ cookie: document.cookie }),
          headers: {
            "Content-Type": "application/json",
            "credentials": "include"
          },
        }).then((res) => res.text())
      );
    });
  }

  public init() {
    this.instanceLog.push(`gart.sh ${this.ver} | id: <span class="yellow">${this.id}</span>`);
    this.instanceLog.push(
      [
        "",
        `<a href="https://github.com/gurrrrrrett3">@gurrrrrrett3</a> ${new Date().getFullYear()}`,
        "Type 'help' for a list of commands",
        "Type 'about' for more info",
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
    const lines = this.instanceLog.slice(this.scrollLocation);

    if (this.element && this.cursorLocation === 0) {
      this.element.innerHTML = lines.join("<br>") + this.cursor;
    } else if (this.element && this.cursorLocation < 0) {
      // underline the char of line length + cursorLocation
      const line = lines[lines.length - 1];
      const lineLength = line.length;
      const cursorLocation = lineLength + this.cursorLocation;
      const lineBeforeCursor = line.slice(0, cursorLocation);
      const lineAfterCursor = line.slice(cursorLocation + 1, lineLength);
      const cursor = line[cursorLocation] === " " ? "_" : line[cursorLocation];
      this.element.innerHTML =
      lines.slice(0, lines.length - 1).join("<br>") +
        "<br>" +
        lineBeforeCursor +
        '<span class="cursor">' +
        cursor +
        "</span>" +
        lineAfterCursor;
    }

    // scroll to bottom
    if (this.element) {
      window.scrollTo({
        top: 999999,
        behavior: "smooth",
      })
    }

  }

  public log(...message: string[]) {
    this.instanceLog.push(...message);
    this.update();
  }

  public openLink(link: string) {
    window.location.href = link;
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
    this.scrollLocation = 0;
    this.update();
  }

  public getPreviousCommand() {
    if (this.commandIndex < this.commands.length) {
      this.commandIndex++;
      this.setCurrentInput(this.commands[this.commandIndex - 1]);

      return this.commands[this.commandIndex - 1] == undefined ? "" : this.commands[this.commandIndex - 1];
    }

    return "";
  }

  public getNextCommand() {
    if (this.commandIndex > 1) {
      this.commandIndex--;
      this.setCurrentInput(this.commands[this.commandIndex - 1]);

      return this.commands[this.commandIndex - 1] == undefined ? "" : this.commands[this.commandIndex - 1];
    }

    return "";
  }

  public getCurrentLines() {
    if (this.element) {
      const lines = this.element.innerHTML.split("<br>");
      return lines.length;
    }

    return 0;
  }
  
}
