import gshConsole from "./console";

interface Command {
    name: string;
    desc: string;
    args: Argument[];
    run: (instance: gshConsole, ...args: any) =>Promise<string[] | string | void>;
}

interface ServerToClientEvents {
    id: (id: string, version: string) => void;
    log: (message: string) => void;
    openLink: (link: string) => void;
    request: (path: string) => void;
    clear: () => void;
    location: (location: string) => void;
    user: (user: string) => void;
  }
  
  interface ClientToServerEvents {
    run: (input: string, callback: (e: string | string[] | void) => void) =>  void;
    session: (session: string) => void;
  }
  
  interface InterServerEvents {
    ping: () => void;
  }
  
  interface SocketData {
    name: string;
    age: number;
  }