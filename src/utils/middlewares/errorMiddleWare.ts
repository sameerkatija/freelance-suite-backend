import { NextFunction, Request, Response } from "express";
import logger from "../logger/winston";

export default function (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.userId;

  logger.log({
    level: "error",
    message: error.message,
    userId,
    error,
  });
  res.status(500).json({ message: error.message });
}
