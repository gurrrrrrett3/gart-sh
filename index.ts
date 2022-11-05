import "./modules/server";
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();


// import commands so that the typescript compiler compiles them
import "./sandbox/bin/cat"