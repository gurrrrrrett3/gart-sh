import console from "../console"
import {Socket} from "socket.io"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types";

export default class InstanceManager {
    public instances = new Map<string, console>()
    
    public createInstance(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
        const name = Math.random().toString(36).substring(2, 8);
        this.instances.set(name, new console(socket))

        return name;
    }

    public getInstance(name: string) {
        return this.instances.get(name);
    }
}