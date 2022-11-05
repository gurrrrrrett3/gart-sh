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

const args = process.argv.slice(2);
if (args.includes("--dev")) {
  console.log("Running in development mode");
  config({ path: path.resolve("./.env.dev") });
} else {
config();
}

const im = new InstanceManager();
const app = express();
const server = args.includes("--dev") ? http.createServer(app) : https.createServer({
  key: fs.readFileSync(process.env.KEY as string),
  cert: fs.readFileSync(process.env.CERT as string),
}, app);

const io = new socket.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  server
);

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
    res.redirect(`/?linked=${await ShortLinkManager.createLink(qs.url as string)}`);
  } else {
    res.redirect(`/?error=No+URL+provided`);
  }
})

app.get("/qr", async (req, res) => {
  const qs = req.query;
  if (qs.url && typeof qs.url === "string") {

    const out = await qrcode.toDataURL(qs.url, {
      margin: 0.5,
      width: 512,
    });

    res.redirect(`/?log=QR+Code+created!+<br><img+src="${out}"/>`);
  } else {
    res.redirect(`/?error=No+URL+provided`);
  }
})

io.on("connection", (socket) => {
  const id = im.createInstance(socket);
  socket.emit("id", id);
});

app.get("/:key", async (req, res) => {
  const url = await ShortLinkManager.getLink(req.params.key);
  if (url && typeof url === "string") {
    res.redirect(url);
  } else if (url && typeof url === "object") {
    
    const u = url.url
    const options = url.options

    if (options.noembed) {
      res.send(`<script>window.location.href = "${u}"</script>`)
    }

  } else {
    res.redirect(`/?error=Link+not+found`);
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port " + (process.env.PORT || 3000));
});
