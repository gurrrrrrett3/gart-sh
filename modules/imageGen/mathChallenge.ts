import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import path from "path";

GlobalFonts.registerFromPath(path.resolve("./asssets/RobotoMono-Regular.ttf"), "Roboto Mono");

export default class MathChallenge {

    public static async mathChallenge() {
        const canvas = createCanvas(600, 300);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        // monospace font
        ctx.font = "48px Roboto Mono";
    
        const num1 = Math.floor(Math.random() * 20);
        const num2 = Math.floor(Math.random() * 20);
        const operator = Math.floor(Math.random() * 4);

        const operators = ["+", "-", "*", "/"];
        ctx.fillText("https://gart.sh", 10, 50);
        ctx.fillText("$ math", 10, 100);
        ctx.fillText(`${num1} ${operators[operator]} ${num2}`, 10, 200);
        ctx.fillText(`= ?`, 10, 250);

        return canvas.toBuffer("image/webp");
    }

}