import gsh from "./modules/terminal";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../modules/types";

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const terminal = new gsh(socket);
let input = "";

let inPaste = false;
let mobile = false;

const keyboardInput = document.getElementById("keyboard-input") as HTMLInputElement;

addEventListener("load", () => {
  if (window.innerWidth < window.innerHeight && window.innerWidth < 600) {
    const keyboardButton = document.getElementById("keyboard") as HTMLButtonElement;
    const mobileText = document.getElementById("mobile-text") as HTMLParagraphElement;
    keyboardButton.removeAttribute("hidden");
    keyboardInput.removeAttribute("hidden");
    mobileText.removeAttribute("hidden");
    keyboardInput.value = ","; // this is the dumbest hack, it makes it so that the mobile keyboard doesn't auto capitalize the first letter
    mobile = true;

    keyboardButton.addEventListener("click", () => {
      keyboardInput.focus();
      mobileText.hidden = true;
    });
  }

  console.log(mobile)
});

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
  const from = qs.get("from");

  if (linked) {
    terminal.log(`Link created! https://gart.sh/${linked} | <button onclick="navigator.clipboard.writeText('https://gart.sh/${linked}')" >Copy</button>`);
  }

  if (log) {
    terminal.log(log);
  }

  if (error) {
    terminal.log(`<span class="red">${error}</span>`);
  }

  if (from) {
    terminal.log(`<button onclick="window.location.href = '${from}'">Return to ${new URL(from).host}</button>`);
  }

  // cookie handling
  const cookie = document.cookie;
  if (cookie) {
    const cookieSplit = cookie.split(";");
    const session = cookieSplit.find((c) => c.startsWith("session="));
    if (session) {
      const sessionSplit = session.split("=");
      const sessionID = sessionSplit[1];
      socket.emit("session", sessionID);
    }
  }
  

  // keypress

  addEventListener("keydown", async (e) => {
    if (inPaste) return;
    const key = !mobile ? e.key : keyboardInput.value;
    processKeypress(key, e);
    
  });
}, 1000);

keyboardInput.addEventListener("input", (e) => {
  let key = (e.target as HTMLInputElement).value

  if (key.startsWith(",")) {
    key = key.slice(1);
   } else if (key == "") {
    key = "Backspace";
   }

   if (key.endsWith(",")) {
    key = key.slice(0, -1).toLowerCase()
   }
  
  processKeypress(key);

  keyboardInput.value = ",";
  keyboardInput.setSelectionRange(1, 1);
});



function processKeypress(key: string, e?: KeyboardEvent) {
  if (e && e.ctrlKey) {
    switch (key) {
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

  switch (key) {
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
      if (e) e.preventDefault();
      break;
    case "Shift":
    case "Control":
    case "Alt":
    case "OS":
    case "CapsLock":
    case "Meta":
    case "ContextMenu":
    case "Escape":
    case "Unidentified":
      break;
    default:
      if (terminal.cursorLocation === 0) {
        input += key;
        terminal.setCurrentInput(input);
      } else {
        // insert char at cursorLocation
        input =
          input.slice(0, input.length + terminal.cursorLocation + 1) +
          key +
          input.slice(input.length + terminal.cursorLocation + 1, input.length);
        terminal.setCurrentInput(input);

        console.log(input);
      }
      break;
  }
}

function estimateLines() {
  // estimate the number of lines using the height of the terminal
  const terminal = document.getElementById("terminal") as HTMLDivElement;
  const terminalHeight = terminal.getBoundingClientRect().height;
  const lineHeight = parseFloat(getComputedStyle(terminal).lineHeight);
  return Math.floor(terminalHeight / lineHeight);
}