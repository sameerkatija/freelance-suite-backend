import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .email("Email must be valid"),
  password: z
    .string({ message: "Password must contain alphanumeric characher(s)" })
    .min(8, { message: "password must contain at least 6 character(s)" }),
  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "First name can only contain letters and spaces",
    }),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Last name can only contain letters and spaces",
    }),
  phoneNumber: z
    .string({ message: "Phone Number is required" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^\+[0-9\s\-()]+$/, { message: "Phone number must be valid" }),
});

export const signInSchema = z.object({
  email: z.string({ message: "Email must be valid" }).email(),
  password: z
    .string({ message: "Password must contain alphanumeric characher(s)" })
    .min(6, { message: "password must contain at least 6 character(s)" }),
});

const LocationSchema = z.object({
  city: z
    .string({ message: "City is required" })
    .min(3, { message: "City must be  valid" }),
  country: z
    .string({ message: "Country is required" })
    .min(3, { message: "Country must be  valid" }),
});

export const EmployerSchema = z.object({
  employer_name: z.string(),
  location: LocationSchema,
  email: z
    .string({ message: "Email is required." })
    .email("Email must be valid"),
  date: z.date(),
});

export const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

export const candidateSchema = z.object({
  candidate_name: z.string({ message: "Candidate Name is required" }),
  position: z.string({ message: "Position is required" }),
  experience: z
    .number({ message: "experience is Required" })
    .min(0, { message: "experience cannot be negative" }), // because
  qualification: z.string({ message: "Qualification is required" }),
  isApproved: z.boolean({ message: "Approved field is required" }),
  summary: z
    .string({ message: "Summary is required" })
    .min(1, "Summary is required")
    .optional(),
  mayBeLater: z.boolean({ message: "May Be Later field is required" }),
  formData: z.string({ message: "Form Data is required" }),
  status: z.enum([
    "SELECTED",
    "NEED_MORE_INFO",
    "MAYBE_LATER",
    "NO",
    "PENDING",
  ]),
  form_id: z.string({ message: "Form ID is required" }),
  skills: z.array(z.string({ message: "Skills are required" })).optional(),
});

export const updateCandidateSchema = z.object({
  candidate_name: z
    .string({ message: "Candidate Name is required" })
    .optional(),
  position: z.string({ message: "Position is required" }).optional(),
  experience: z
    .number()
    .min(0, { message: "experience cannot be negative" })
    .optional(), // because
  qualification: z.string({ message: "Qualification is required" }).optional(),
  isApproved: z.boolean({ message: "Approved field is required" }).optional(),
  summary: z
    .string({ message: "Summary is required" })
    .min(1, "Summary is required")
    .optional(),
  mayBeLater: z
    .boolean({ message: "May Be Later field is required" })
    .optional(),
  formData: z.string({ message: "Form Data is required" }).optional(),
  status: z
    .enum(["SELECTED", "NEED_MORE_INFO", "MAYBE_LATER", "NO", "PENDING"])
    .optional(),
  form_id: z.string({ message: "Form ID is required" }).optional(),
  skills: z.array(z.string({ message: "Skills are required" })).optional(),
});

export const ProjectSchema = z.object({
  employer: z.string({ message: "Employer is required" }), // Assuming employer ID is stored as string
  position: z
    .string({ message: "Position is required" })
    .min(3, { message: "Position must be  valid" }),
  date: z.date({ message: "Date is required" }),
  location: LocationSchema,
  status: z.optional(
    z.enum(["Building", "Reviewing", "Selection_&_Finalization", "Completed"])
  ),
  candidates: z.array(z.string({ message: "Candidate is required" })),
});

export const UpdateProjectSchema = z.object({
  employer: z.string({ message: "Employer is required" }).optional(),
  position: z
    .string({ message: "Position is required" })
    .min(3, { message: "Position must be  valid" })
    .optional(),
  date: z.date({ message: "Date is required" }).optional(),
  location: LocationSchema.optional(),
  status: z.optional(
    z.enum(["Building", "Reviewing", "Selection_&_Finalization", "Completed"])
  ),
  candidates: z
    .array(z.string({ message: "Candidate is required" }))
    .optional(),
});

export const OTPSchema = z.object({
  otp: z
    .string({ message: "OTP is required" })
    .min(6, { message: "OTP is invalid" })
    .max(6, { message: "OTP is invalid" }),
});

export const candidateFormSchema = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string({ message: "Description is required" }),
  form_pages: z.array(z.unknown()).optional(),
  isActive: z.boolean().optional(),
  submission: z.number().optional(),
});

export const updateFormSchema = z.object({
  isActive: z.boolean().optional(),
  form_pages: z.array(z.unknown()).optional(),
});

const NotificationSchema = z.object({
  new_candidate: z.boolean().default(false).optional(),
  new_selection: z.boolean().default(false).optional(),
  new_comment: z.boolean().default(false).optional(),
  watchlist_addition: z.boolean().default(false).optional(),

  pushNotification: z.boolean().default(false),
  emailNotification: z.boolean().default(false),
});

export const userSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
  phoneNumber: z
    .string({ message: "Phone Number is required" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^\+[0-9\s\-()]+$/, { message: "Phone number must be valid" }),
  address: z.string().optional(),
  notifications: NotificationSchema.optional(),
  timeZone: z.string().optional(),
});

export const emailSchema = z.object({
  email: z.string({ message: "Email must be valid" }).email(),
});
export const resetPasswordSchema = z.object({
  password: z
    .string({ message: "Password must contain alphanumeric characher(s)" })
    .min(8, { message: "password must contain at least 6 character(s)" }),
});
