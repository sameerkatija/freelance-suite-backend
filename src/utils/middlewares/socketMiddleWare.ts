import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

const socketMiddleware = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.io = io; // Attach io to the request object
    next();
  };
};

export default socketMiddleware;
