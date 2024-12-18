import { Request, Response } from "express";
import Employer, { IEmployer } from "../models/employeer";
import Project, { IProject } from "../models/project";
import mongoose from "mongoose";
import Candidate, { ICandidate } from "../models/candidate";

export const newProject = async (req: Request, res: Response) => {
  const user = req.user?.userId;
  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { employer, position, date, location, status, candidates } = req.body;
  if (!mongoose.Types.ObjectId.isValid(employer)) {
    return res.status(404).json({ message: "Employeer Id is Invalid" });
  }
  const emp: IEmployer | null = await Employer.findById(employer);
  if (!emp) {
    return res.status(404).json({ message: "Employer not found" });
  }

  const CandidateobjectIds = candidates.map((candidate: string) => {
    if (!mongoose.Types.ObjectId.isValid(candidate)) {
      return res.status(404).json({ message: "Candidate Id is Invalid" });
    }
    return new mongoose.Types.ObjectId(candidate);
  });

  const candidatesFromDB = await Candidate.find({
    _id: { $in: CandidateobjectIds },
  });
  if (!(candidatesFromDB.length === CandidateobjectIds.length)) {
    return res.status(404).json({ message: "Candidate Not Found" });
  }
  const project: IProject = new Project({
    employer,
    position,
    date,
    location,
    status: status ?? "Building",
    candidates: CandidateobjectIds,
    createdBy: new mongoose.Types.ObjectId(user),
  });
  await project.save();
  res.status(201).json({
    message: "Project created successfully",
    project,
  });
};

export const getProjects = async (req: Request, res: Response) => {
  const user = req.user?.userId;
  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const projects = await Project.find({
    createdBy: new mongoose.Types.ObjectId(user),
  })
    .populate({
      path: "employer",
    })
    .populate({ path: "candidates", populate: { path: "comments" } })

    .exec();
  return res.status(200).json(projects);
};

export const getUniqueProject = async (req: Request, res: Response) => {
  const user = req.user?.userId;
  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { project_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(project_id)) {
    return res.status(404).json({ message: "404 - Missing project ID" });
  }
  const project = await Project.findOne({
    _id: project_id,
  })
    .populate({ path: "employer" })
    .populate({ path: "candidates", populate: { path: "comments" } });

  return res.status(200).json({ project: project });
};

export const updateProject = async (req: Request, res: Response) => {
  const user = req.user?.userId;
  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { project_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(project_id)) {
    return res.status(404).json({ message: "404 - Missing project ID" });
  }
  const project = await Project.findOne({ _id: project_id, createdBy: user });
  if (!project) {
    return res.status(404).json({ message: "404 - Project Not Found" });
  }
  const { employer, position, date, location, status, candidates } = req.body;
  await Project.updateOne(
    { _id: project_id },
    {
      $set: {
        employer,
        position,
        date,
        location,
        status,
        candidates,
      },
    }
  );
  res.status(200).json({
    message: "Project Updated Successfully!",
  });
};

export const deleteProjectById = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing Project ID" });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(400).json({ message: "Project Not Found" });
  }
  if (!project?.createdBy.equals(userId)) {
    return res
      .status(401)
      .json({ message: "Unauthorized to perform this action" });
  }
  await Project.findByIdAndDelete(projectId);
  return res.status(200).json({ message: "Project Deleted Successfully!" });
};
