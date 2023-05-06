import express from "express";
import path from "path";
import http from "http";
import https from "https";
import socket from "socket.io";
import fs from "fs";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types";
import InstanceManager from "./instanceManager";
import ShortLinkManager from "../links";
import { config } from "dotenv";
import qrcode from "qrcode";
import apiRouter from "./routes/api";
import authRouter from "./routes/auth";
import ipMemeRouter from "./routes/images/ipmeme";
import cors from "cors";

const args = process.argv.slice(2);
if (args.includes("--dev")) {
  console.log("Running in development mode");
  config({ path: path.resolve("./.env.dev") });
} else {
  config();
}

const im = new InstanceManager();
const app = express();
app.use(express.json());
const server = args.includes("--dev")
  ? http.createServer(app)
  : https.createServer(
      {
        key: fs.readFileSync(process.env.KEY as string),
        cert: fs.readFileSync(process.env.CERT as string),
      },
      app
    );

const io = new socket.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  server
);

app.use(cors());

app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/images/ipmeme", ipMemeRouter);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/index.html"));
});

app.get("/main.js", (req, res) => {
  res.sendFile(path.resolve("./dist/frontend/main.js"));
});

app.get("/main.js.LICENSE.txt", (req, res) => {
  res.sendFile(path.resolve("./dist/frontend/main.js.LICENSE.txt"));
});

app.get("/link", async (req, res) => {
  const qs = req.query;
  if (qs.url) {
    res.redirect(`/?linked=${await ShortLinkManager.createLink(qs.url as string)}&from=${qs.url}`);
  } else {
    res.redirect(`/?error=No+URL+provided`);
  }
});

app.get("/qr", async (req, res) => {
  const qs = req.query;
  if (qs.url && typeof qs.url === "string") {
    const link = await ShortLinkManager.createLink(qs.url);
    const out = await qrcode.toDataURL(link.key!, {
      margin: 0.5,
      width: 512,
    });

    const dataLink = await ShortLinkManager.createLink(out);
    const dataURL = dataLink.key!;

    res.redirect(`/?log=QR+Code+created!+<br><img+src="${dataURL}"/>&from=${qs.url}`);
  } else {
    res.redirect(`/?error=No+URL+provided`);
  }
});

app.get("/timer", async (req, res) => {
  res.sendFile(path.resolve("./client/pages/timer.html"));
});

app.get("/fanart", async (req, res) => {
  res.sendFile(path.resolve("./client/pages/fanart.html"));
});

io.on("connection", (socket) => {
  const id = im.createInstance(socket);
  socket.emit(
    "id",
    id,
    JSON.parse(fs.readFileSync(path.resolve("./package.json")).toString()).version,
    fs.readFileSync(path.resolve("./sandbox/home/gart/motd.html"), "utf8")
  );
});

app.get("/:key", async (req, res) => {
  const url = await ShortLinkManager.getLink(req.params.key);

  res.setHeader("Content-Type", "image/webp");
  res.setHeader("cache-control", "no-cache, no-store, must-revalidate");
  res.setHeader("pragma", "no-cache");
  res.setHeader("expires", "0");

  if (url && typeof url === "string") {
    res.redirect(url);
  } else if (url && typeof url === "object") {
    console.log(url);

    const u = url.url;
    const options = url.options;

    if (options.grab) {
      await ShortLinkManager.logIp(req.params.key, req.ip);
    }

    if (options.noembed) {
      res.send(`<script>window.location.href = "${u}"</script>`);
    }

    res.redirect(url.url);
  } else {
    res.redirect(`/?error=Link+not+found`);
  }
});

app.get("/.well-known/matrix/server", (req, res) => {
  res.send({
    "m.server": "matrix.gart.sh:443",
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port " + (process.env.PORT || 3000));
});
