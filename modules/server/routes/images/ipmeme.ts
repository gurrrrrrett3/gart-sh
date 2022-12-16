import { loadImage, createCanvas } from "@napi-rs/canvas";
import { Router } from "express";
import path from "path";
import htmlifyImage from "../../../util/htmlifyImage";
const router = Router();

router.get("/:id", async (req, res) => {
  const bg = await loadImage(path.resolve(`./assets/images/ipmeme${parseInt(req.params.id)}.png`));

  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(bg, 0, 0);

  ctx.font = "bold 30px sans-serif";
  ctx.fillStyle = "black";

  let ip = req.headers["x-forwarded-for"]?.at(0) || req.ip;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7);
  }

  const textWidth = ctx.measureText(ip).width;

  ctx.fillText(ip, (bg.width - textWidth) / 2, canvas.height - 50);

  const dataURL = canvas.toDataURL();
  res.send(htmlifyImage(dataURL));
});

export default router;
