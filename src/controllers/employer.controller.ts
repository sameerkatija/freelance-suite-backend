import { Request, Response } from "express";
import Employer, { IEmployer } from "../models/employeer";
import mongoose from "mongoose";
import generatePassword from "../utils/generatePassword";
import { sendPassword } from "../utils/nodeMailer/mailer";
import User from "../models/user";

export const newEmployer = async (req: Request, res: Response) => {
  const { employer_name, location, date, email } = req.body;
  const createdBy = req.user?.userId;
  if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const password = generatePassword(8);
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = new User({
    email,
    password,
    active: true,
    role: "EMPLOYER", // Set the role to EMPLOYER
  });
  const createdUser = await user.save();

  const newEmployer: IEmployer = new Employer({
    employer_name,
    location,
    date,
    email,
    password,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });
  const createdEmp = await newEmployer.save();
  createdUser.emp = createdEmp._id as mongoose.Types.ObjectId;
  await createdUser.save();
  await sendPassword(email, password);
  res.status(200).json({
    message: "Employer created successfully",
    employer: { newEmployer, ...email },
  });
};

export const getAllEmployers = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const employers = await Employer.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "employer",
        as: "projects",
      },
    },
    {
      $addFields: {
        projectCount: { $size: "$projects" },
      },
    },
  ]);
  res.status(200).json(employers);
};

export const getUniqueEmployers = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { emp_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(emp_id)) {
    return res.status(404).json({ message: "404 - Missing Employer ID" });
  }
  // const employeer = await Employer.findOne({ _id: emp_id });
  const employer = await Employer.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(emp_id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "employer",
        as: "projects",
      },
    },
    {
      $addFields: {
        projectCount: { $size: "$projects" },
      },
    },
  ]);

  return res.status(200).json({ employeer: employer[0] });
};

export const regeneratePassword = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { email } = req.body;
  const user = await Employer.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // const password = generatePassword(8);
  // await User.updateOne(
  //   { _id: userId },
  //   {
  //     $set: {
  //       password,
  //     },
  //   }
  // );
  // await sendPassword(email, Employer.password);
  res.status(200).json({
    message: "Password regenerated successfully",
    password: user.password
      ? user.password
      : "Password not found! Kindly reset the password",
  });
};
