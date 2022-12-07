import { createCanvas } from "@napi-rs/canvas";

export default class BannerGen {

    public static async genBanner() {
        const canvas = createCanvas(1364, 480);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 1364, 480);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px sans-serif";

        ctx.fillText("gart.sh", 10, 50);
        ctx.fillText(`Currently serving ${Math.floor(Math.random() * 1000)} users`, 10, 100);

        return canvas.toBuffer("image/webp");
    }

}