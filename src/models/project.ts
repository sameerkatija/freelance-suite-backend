import mongoose, { Document, Schema, Model } from "mongoose";
import { ILocation } from "./employeer";

export interface IProject extends Document {
  employer: mongoose.Types.ObjectId;
  position: string;
  date: Date;
  location: ILocation;
  status: "Building" | "Reviewing" | "Selection_&_Finalization" | "Completed";
  createdBy: mongoose.Types.ObjectId;
  candidates: mongoose.Types.ObjectId[];
}

const ProjectSchema: Schema = new Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["Building", "Reviewing", "Selection_&_Finalization", "Completed"],
    default: "Building",
  },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate", // Reference to the Candidate model
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  ProjectSchema
);

export default Project;
