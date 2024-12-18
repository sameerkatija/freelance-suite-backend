import mongoose, { Mongoose } from "mongoose";
import Form from "../models/dynamicForm";
import { Request, Response } from "express";
import Candidate, { ICandidate } from "../models/candidate";
import Comment from "../models/comment";
import { Server } from "socket.io";
import { generateNotification } from "../utils/notifications/notification.utils";
import User from "../models/user";
import Employer from "../models/employeer";

let io: Server;

export const setIOinCandidate = (server: Server) => {
  io = server;
};

export const createForm = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { name, description, form_pages, isActive, submission } = req.body;
  const dynamicForm = new Form({
    name,
    description,
    form_pages,
    isActive,
    submission,
  });
  dynamicForm.createdBy = new mongoose.Types.ObjectId(userId);
  await dynamicForm.save();
  return res.status(200).json({ message: "Form has been saved" });
};

export const updateForm = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { formId } = req.params;
  if (!formId || !mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(401).json({ message: "Unauthorized - Missing Form ID" });
  }

  const { isActive, form_pages } = req.body;

  const form = await Form.findById(formId);
  if (!form) {
    return res.status(400).json({ message: "Form Not Found" });
  }

  await Form.findByIdAndUpdate(formId, {
    $set: { isActive, form_pages },
  });

  return res.status(200).json({ message: "Form Updated Successfully!" });
};

export const getForm = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const forms = await Form.find({
    createdBy: new mongoose.Types.ObjectId(userId),
  });
  return res.status(200).json({ forms });
};

export const getFormById = async (req: Request, res: Response) => {
  // const userId = req.user?.userId;

  // if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  //   return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  // }
  const { formId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(401).json({ message: "Unauthorized - Missing Form ID" });
  }
  const form = await Form.findOne({ _id: formId }); //createdBy: userId
  return res.status(200).json({ forms: form });
};

export const deleteFormByID = async (req: Request, res: Response) => {
  const { formId } = req.params;
  const userId = req.user?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(401).json({ message: "Unauthorized - Missing Form ID" });
  }

  const form = await Form.findById(formId);
  if (!form) {
    return res.status(400).json({ message: "Form Not Found" });
  }
  if (!form?.createdBy.equals(userId)) {
    return res
      .status(401)
      .json({ message: "Unauthorized to perform this action" });
  }
  await Form.findByIdAndDelete(formId);
  return res.status(200).json({ message: "Form Deleted Successfully!" });
};

export const createCandidate = async (req: Request, res: Response) => {
  const {
    candidate_name,
    position,
    experience,
    qualification,
    isApproved,
    summary,
    mayBeLater,
    status,
    formData,
    form_id,
    skills,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(form_id)) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Incorrect form ID" });
  } else {
    const candidates = await Candidate.find({ form_id });
    const form = await Form.findById(form_id);
    if (!form) {
      return res.status(404).json({ message: "Form Not Found" });
    }
    form.submission = candidates.length + 1;
    await form.save();
  }
  const newCandidate = new Candidate({
    candidate_name,
    position,
    experience,
    qualification,
    formData,
    isApproved,
    summary,
    mayBeLater,
    status,
    form_id,
    skills,
    profile_picture: req.file?.location,
  });
  const savedCandidate: ICandidate = await newCandidate.save();
  generateNotification(
    io,
    savedCandidate._id as string,
    `New Form submission for ${savedCandidate.position}`,
    "New Form"
  );
  res.status(200).json({
    message: "Candidate created successfully!",
    Candidate: newCandidate,
  });
};
export const getCandidates = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const candidatesForms = await Form.find(
    {
      createdBy: new mongoose.Types.ObjectId(userId),
    },
    { _id: 1 }
  );
  const formIds = candidatesForms.map((form) => form._id);
  const candidates = await Candidate.find({
    form_id: { $in: formIds },
  }).populate("comments"); // Populate the comments field

  res.status(200).json({ candidates });
};

export const updateCandidate = async (req: Request, res: Response) => {
  const { candidateID } = req.params;
  if (!candidateID || !mongoose.Types.ObjectId.isValid(candidateID)) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Candidate Form ID" });
  }

  const {
    candidate_name,
    position,
    experience,
    qualification,
    formData,
    isApproved,
    summary,
    mayBeLater,
    status,
    form_id,
    skills,
  } = req.body;
  const userId = req.user?.userId; // Assuming userId is a string

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const candidate = await Candidate.findById(candidateID);

  if (!candidate) {
    return res.status(400).json({ message: "Form Not Found" });
  }
  if (user.role === "EMPLOYER") {
    if (
      (status !== undefined && status !== candidate.status) ||
      (mayBeLater !== undefined && mayBeLater !== candidate.mayBeLater)
    ) {
      await Candidate.updateOne(
        { _id: candidateID },
        {
          $set: {
            status,
            mayBeLater,
          },
        }
      );
      const emp = await Employer.findById(user.emp);
      if (!emp) {
        return res.status(400).json({ message: "Employer Not Found" });
      }
      if (status === "selected") {
        generateNotification(
          io,
          userId,
          `${emp.employer_name} | ${candidate.candidate_name} is  selected for ${candidate.position}`,
          "Selected"
        );
      }
    }
  }
  if (user.role === "RECRUITER") {
    await Candidate.updateOne(
      { _id: candidateID },
      {
        $set: {
          formData,
          isApproved,
        },
      }
    );
    generateNotification(
      io,
      userId,
      `${candidate.candidate_name} profile has been saved`,
      "Saved"
    );
  }
  // io will be here for update
  return res.status(200).json({ message: "Candidate Updated Successfully!" });
};

export const deleteCandidateByID = async (req: Request, res: Response) => {
  const { candidateID } = req.params;
  const userId = req.user?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  if (!candidateID || !mongoose.Types.ObjectId.isValid(candidateID)) {
    return res.status(401).json({ message: "Unauthorized - Missing Form ID" });
  }

  const candidate = await Candidate.findById(candidateID);
  if (!candidate) {
    return res.status(400).json({ message: "Candidate Not Found" });
  }
  await Candidate.findByIdAndDelete(candidateID);
  return res.status(200).json({ message: "Candidate Deleted Successfully!" });
};

export const deleteCandidatesByID = async (req: Request, res: Response) => {
  const { candidatesIDArr } = req.body;
  const userId = req.user?.userId;

  // Validate user ID
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }

  // Validate candidates ID array
  if (!Array.isArray(candidatesIDArr) || candidatesIDArr.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid or missing candidates ID array" });
  }

  // Validate candidate IDs
  const invalidIds = candidatesIDArr.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );
  if (invalidIds.length > 0) {
    return res
      .status(400)
      .json({ message: "Invalid candidate IDs", invalidIds });
  }

  // Attempt to delete candidates
  const deleteResults = await Candidate.deleteMany({
    _id: { $in: candidatesIDArr },
  });

  if (deleteResults.deletedCount === 0) {
    return res.status(400).json({ message: "No candidates found to delete" });
  }

  return res.status(200).json({ message: "Candidates Deleted Successfully!" });
};

export const getUniqueCandidate = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { candidateID } = req.params;
  if (!mongoose.Types.ObjectId.isValid(candidateID)) {
    return res.status(404).json({ message: "404 - Missing Candidate ID" });
  }
  const candidate = await Candidate.findOne({
    _id: candidateID,
  }).populate("comments");
  return res.status(200).json({ candidate });
};

export const createCommentForCandidate = async (
  req: Request,
  res: Response
) => {
  const { candidateID } = req.params;
  const userId = req.user?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  if (!user.emp) {
    return res.status(400).json({ message: "User is not an employer" });
  }
  const emp = await Employer.findById(user.emp);
  if (!emp) {
    return res.status(400).json({ message: "Employer Not Found" });
  }
  if (!candidateID || !mongoose.Types.ObjectId.isValid(candidateID)) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing Candidate ID" });
  }

  const candidate = await Candidate.findById(candidateID);
  if (!candidate) {
    return res.status(400).json({ message: "Candidate Not Found" });
  }
  const { comment } = req.body;
  const newComment = new Comment({
    comment,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  const savedComment = await newComment.save();
  candidate.comments.push(savedComment._id as mongoose.Types.ObjectId);
  await candidate.save();
  // Repopulate the comments field to include the newly added comment
  const updatedCandidate = await Candidate.findById(candidateID).populate(
    "comments"
  );

  generateNotification(
    io,
    userId,
    `${emp.employer_name} | ${comment}`,
    "Commented"
  );
  res.status(200).json({
    message: "Comment added successfully!",
    candidate: updatedCandidate,
  });
};
