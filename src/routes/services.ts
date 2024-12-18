import express from "express";
import {
  loginController,
  signUpController,
  generateOTPController,
  verifyOTPController,
  resetUserPasswordController,
  getGooglePage,
  googleCallBackHandler,
} from "../controllers/auth.controller";

import {
  newEmployer,
  getAllEmployers,
  getUniqueEmployers,
  regeneratePassword,
} from "../controllers/employer.controller";

import {
  createCandidate,
  createCommentForCandidate,
  createForm,
  deleteCandidateByID,
  deleteCandidatesByID,
  deleteFormByID,
  getCandidates,
  getForm,
  getFormById,
  getUniqueCandidate,
  setIOinCandidate,
  updateCandidate,
  updateForm,
} from "../controllers/candidate.controllers";
import {
  CommentSchema,
  EmployerSchema,
  OTPSchema,
  ProjectSchema,
  UpdateProjectSchema,
  candidateFormSchema,
  candidateSchema,
  emailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateCandidateSchema,
  updateFormSchema,
  userSchema,
} from "../utils/validation/zodSchema";
import validateRequest from "../utils/middlewares/validateRequest";
import verifyToken from "../utils/middlewares/verifyToken";
import {
  newProject,
  getProjects,
  getUniqueProject,
  updateProject,
  deleteProjectById,
} from "../controllers/project.controller";
import { getUser, setUser } from "../controllers/recruiter.controllers";
import { upload, uploadFile } from "../controllers/s3.controllers";
import { getCities, getCountries } from "../controllers/utils.controller";
import { Server } from "socket.io";
import socketMiddleware from "../utils/middlewares/socketMiddleWare";
import { getNotifications } from "../controllers/notifcation.controller";

const router = express.Router();

export default (io: Server) => {
  // Accessing io inside the Candidate
  setIOinCandidate(io);
  router.get("/devTest", (req, res) => {
    const html = `
    <html>
    <head></head>
    <body>
      <h1>Hello Dev</h1>
      <ul id="notifications"></ul>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <script>
    const socket = io();
    socket.on('notification', (data) => {
            const notificationsList = document.getElementById('notifications');
            const li = document.createElement('li'); 
            li.textContent = \`\${data.message}\`; 
            notificationsList.appendChild(li); 
        });
    </script>
    </body>
    </html>
    `;
    return res.status(200).send(html);
  });
  router.post("/login", validateRequest(signInSchema), loginController);
  router.post(
    "/signup",
    validateRequest(signUpSchema),
    upload.single("profile_picture"),
    signUpController
  );
  router.post(
    "/user/verify-otp",
    validateRequest(OTPSchema),
    verifyOTPController
  );

  // Google Login

  // router.get("/auth/google", getGooglePage);

  // router.get("/auth/google/callback", googleCallBackHandler);

  // end Google Login

  router.post(
    "/reset-password",
    validateRequest(emailSchema),
    generateOTPController
  );
  router.post(
    "/reset-password/:token",
    validateRequest(resetPasswordSchema),
    resetUserPasswordController
  );
  // emp routes
  router.post(
    "/new-employer",
    verifyToken,
    validateRequest(EmployerSchema),
    newEmployer
  );
  router.post(
    "/regenerate-employer-password",
    verifyToken,
    validateRequest(emailSchema),
    regeneratePassword
  );
  // router.post('');
  router.get("/employer", verifyToken, getAllEmployers);
  router.get("/employer/:emp_id", verifyToken, getUniqueEmployers);
  router.post(
    "/new-project",
    verifyToken,
    validateRequest(ProjectSchema),
    newProject
  );
  router.get("/projects", verifyToken, getProjects);
  router.get("/project/:project_id", verifyToken, getUniqueProject);
  router.delete("/project/:projectId", verifyToken, deleteProjectById);
  router.put(
    "/project/:project_id",
    verifyToken,
    validateRequest(UpdateProjectSchema),
    updateProject
  );

  router.post(
    "/create-candidate-form",
    validateRequest(candidateFormSchema),
    verifyToken,
    createForm
  );
  router.get("/get-candidate-form", verifyToken, getForm);
  router.get("/get-candidate-form/:formId", getFormById);
  router.delete("/form/:formId", verifyToken, deleteFormByID);
  router.put(
    "/form/:formId",
    verifyToken,
    validateRequest(updateFormSchema),
    updateForm
  );
  // candidate
  //emit on this
  router.post(
    "/create-candidate",
    validateRequest(candidateSchema),
    upload.single("profile_picture"),
    createCandidate
  );
  router.get("/get-candidate", verifyToken, getCandidates);
  router.get("/candidate/:candidateID", verifyToken, getUniqueCandidate);
  router.put(
    "/candidate/:candidateID",
    verifyToken,
    validateRequest(updateCandidateSchema),
    updateCandidate
  );
  router.delete("/candidate/:candidateID", verifyToken, deleteCandidateByID);
  router.delete("/candidate", verifyToken, deleteCandidatesByID);
  router.post(
    "/candidate/:candidateID/comment",
    validateRequest(CommentSchema),
    verifyToken,
    createCommentForCandidate
  );

  router.get("/me", verifyToken, getUser);
  router.put("/me", verifyToken, validateRequest(userSchema), setUser);

  router.post("/upload-documents", upload.single("file"), uploadFile);

  //utils

  router.get("/countries", getCountries);

  router.post("/cities", getCities);

  router.get("/notification", verifyToken, getNotifications);
  return router;
};
