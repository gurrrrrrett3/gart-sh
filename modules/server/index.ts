import express from "express";
import path from "path";
import http from "http";
import socket from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types";
import InstanceManager from "./instanceManager";
import ShortLinkManager from "../links";

const im = new InstanceManager();
const app = express();
const server = http.createServer(app);

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

io.on("connection", (socket) => {
  const id = im.createInstance(socket);
  socket.emit("id", id);
});

app.get("/:key", (req, res) => {
  const url = ShortLinkManager.getLink(req.params.key);
  if (url) {
    res.redirect(url);
  } else {
    res.redirect("/");
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
