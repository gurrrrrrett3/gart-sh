import { terminal } from "..";

const secrets = [
  {
    // ctrl, ctrl, shift, tab, control, shift, shift
    activationCode: [ 67, 67, 83, 84, 67, 83, 83 ],
    execute: () => {
        const box = document.createElement("div");       
        box.style.position = "absolute";
        box.style.top = "0";
        box.style.left = "0";
        box.style.width = "100%";
        box.style.height = "100%";
        box.style.background = "black";
        box.style.color = "white";

        const secretInput = document.createElement("input")
        secretInput.style.background = "black";
        secretInput.style.color = "white";
        secretInput.style.border = "none";
        secretInput.style.fontSize = "48px";
        secretInput.style.fontFamily = "monospace";
        secretInput.style.padding = "10px";
        secretInput.style.boxSizing = "border-box";
        secretInput.style.outline = "none";
        secretInput.placeholder = "Enter secret code";

        // center the input
        const inputHeight = parseFloat(getComputedStyle(secretInput).height.replace("px", ""));
        const inputWidth = parseFloat(getComputedStyle(secretInput).width.replace("px", ""));
        const terminalHeight = parseFloat(getComputedStyle(terminal.element).height.replace("px", ""));
        const terminalWidth = parseFloat(getComputedStyle(terminal.element).width.replace("px", ""));
        const top = (terminalHeight - inputHeight) / 2;
        const left = (terminalWidth - inputWidth) / 2;
        secretInput.style.top = `${top}px`;
        secretInput.style.left = `${left}px`;
        secretInput.style.position = "absolute";
        
        box.appendChild(secretInput);
        document.body.appendChild(box);
        
        terminal.clear();
        secretInput.focus();
        terminal.enabled = false;

        secretInput.addEventListener("keydown", async (e) => {
            if (e.key === "Enter") {
                const secretCode = secretInput.value;                
                const res = await fetch(`https://bin.gart.sh/${secretCode}/raw`);
                if (res.status === 200) {
                    const code = await res.text();
                    box.remove();
                    terminal.clear();
                    terminal.enabled = true
                    const script = document.createElement("script");
                    script.innerHTML = code;
                    document.body.appendChild(script);
                } else {
                    secretInput.value = "";
                    secretInput.placeholder = "Invalid secret code";
                }
            }
        })
    },
  },
];

let currentCode: number[] = [];

document.addEventListener("keydown", (e) => {
    currentCode.push(e.key.toUpperCase().charCodeAt(0));
    if (currentCode.length > 7) currentCode.shift();
    for (let i = 0; i < secrets.length; i++) {
      const secret = secrets[i];
      const activationCode = secret.activationCode;
      if (currentCode.length < activationCode.length) continue;
      const match = currentCode
        .slice(-activationCode.length)
        .every((value, index) => value === activationCode[index]);
      if (match) {
        e.preventDefault();
        secret.execute();
        currentCode = [];
      }
    }
  
});
