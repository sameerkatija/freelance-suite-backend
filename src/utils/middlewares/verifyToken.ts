import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../types";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = (decoded as User) ?? null;
    next();
  });
};

export default verifyToken;
