import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";

const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body };
    if (typeof data?.date === "string") {
      data.date = new Date(data.date);
    }
    if (typeof data?.createdAt === "string") {
      data.createdAt = new Date(data.createdAt);
    }
    try {
      schema.parse(data);
      next();
    } catch (e: any) {
      return res.status(400).json({ message: e.errors[0].message });
    }
  };
};

export default validateRequest;
