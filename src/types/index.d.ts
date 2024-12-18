import { Request } from "express";
import { Server } from "socket.io";
declare global {
  namespace Express {
    export interface Request {
      user?: User | null;
      file?: Ifile | any;
      io?: Server;
    }
  }
}

export type User = {
  userId?: string;
};

export type Ifile = {
  location?: string;
};
