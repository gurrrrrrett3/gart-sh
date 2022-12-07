import { createCanvas } from "@napi-rs/canvas";

export default class MathChallenge {

    public static async mathChallenge() {
        const canvas = createCanvas(1364, 480);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 1364, 480);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px sans-serif";
    
        const num1 = Math.floor(Math.random() * 20);
        const num2 = Math.floor(Math.random() * 20);
        const operator = Math.floor(Math.random() * 4);

        const operators = ["+", "-", "*", "/"];

        ctx.fillText(`${num1} ${operators[operator]} ${num2}`, 10, 50);
        ctx.fillText(`= ?`, 10, 100);

        return canvas.toBuffer("image/webp");
    }

}