import gsh from "./modules/terminal";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../modules/types";

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const terminal = new gsh(socket);
let input = "";

let inPaste = false;

addEventListener("load", () => {});

document.getElementById("paste-submit")?.addEventListener("click", (e) => {
  e.preventDefault();
  input += (document.getElementById("paste") as HTMLInputElement).value;
  terminal.setCurrentInput(input);
  document.getElementById("paste-form")?.setAttribute("hidden", "true");
  (document.getElementById("paste") as HTMLInputElement).value = "";
  inPaste = false;
});

const qs = new URLSearchParams(location.search);
if (qs) {
  // remove qs
  history.replaceState({}, document.title, location.pathname);
}

setTimeout(() => {
  // qs handling

  const linked = qs.get("linked");
  const log = qs.get("log");
  const error = qs.get("error");

  if (linked) {
    terminal.log(`Link created! https://gart.sh/${linked} | <button onclick="navigator.clipboard.writeText('https://gart.sh/${linked}')" >Copy</button>`);
  }

  if (log) {
    terminal.log(log);
  }

  if (error) {
    terminal.log(`<span class="red">${error}</span>`);
  }

  

  // keypress

  addEventListener("keydown", async (e) => {
    if (inPaste) return;

    if (e.ctrlKey) {
      switch (e.key) {
        case "l":
          terminal.clear();
          break;
        case "v":
          // open a popup to paste text
          document.getElementById("paste-form")?.attributes.removeNamedItem("hidden");
          document.getElementById("paste")?.focus();
          inPaste = true;
          break;

        case "Backspace":
          // delete until the next space
          const lastSpace = input.lastIndexOf(" ");
          input = input.slice(0, lastSpace == -1 ? 0 : lastSpace - 1);
          terminal.setCurrentInput(input);
      }

      return;
    }

    switch (e.key) {
      case "Enter":
        terminal.run(input);
        input = "";
        break;
      case "Backspace":
        input = input.slice(0, -1);
        terminal.setCurrentInput(input);
        break;
      case "ArrowUp":
        input = terminal.getPreviousCommand();
        break;
      case "ArrowDown":
        input = terminal.getNextCommand();
        break;
      case "ArrowLeft":
        // e.preventDefault();
        // if (input.length - terminal.cursorLocation - 1 >= 0) {
        //   terminal.cursorLocation--;
        //   terminal.log(terminal.cursorLocation.toString());
        //   terminal.update();
        // }
        break;
      case "ArrowRight":
        // e.preventDefault();
        // terminal.cursorLocation++;
        // terminal.update();
        break;
      case "Tab":
        e.preventDefault();
        break;
      case "Shift":
      case "Control":
      case "Alt":
      case "OS":
      case "CapsLock":
      case "Meta":
      case "ContextMenu":
      case "Escape":
        break;
      default:
        if (terminal.cursorLocation === 0) {
          input += e.key;
          terminal.setCurrentInput(input);
        } else {
          // insert char at cursorLocation
          input =
            input.slice(0, input.length + terminal.cursorLocation + 1) +
            e.key +
            input.slice(input.length + terminal.cursorLocation + 1, input.length);
          terminal.setCurrentInput(input);

          console.log(input);
        }
        break;
    }
  });
}, 1000);
