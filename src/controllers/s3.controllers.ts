import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import sharp from "sharp";
// import ffmpeg from "fluent-ffmpeg";
// import fs from "fs";
// import path from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

// Define the storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "temp/"); // Destination folder
//   },
//   filename: function (req, file, cb) {
//     // Extract the file extension
//     const ext = path.extname(file.originalname);
//     // Create a unique filename (you can use any method to ensure uniqueness)
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     // Combine unique suffix with the original extension
//     cb(null, uniqueSuffix + ext);
//   },
// });

// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 200 * 1024 * 1024 },
// });

// // Configure Multer to use S3 storage
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME as string,
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// const processFile = async (filePath: string, fileType: string) => {
//   const outputPath = `temp/compressed_${Date.now()}_${path.basename(filePath)}`;

//   if (fileType.startsWith("image")) {
//     await sharp(filePath)
//       .resize({ width: 800 }) // Resize the image to a max width of 800px
//       .toFile(outputPath);
//   } else if (fileType.startsWith("video")) {
//     await new Promise((resolve, reject) => {
//       ffmpeg(filePath)
//         .outputOptions([
//           "-vf",
//           "scale=640:-1", // Resize video to width of 640px while maintaining aspect ratio
//           "-c:v",
//           "libx264", // Use libx264 codec for video encoding
//           "-crf",
//           "18", // Set Constant Rate Factor to 18 for better quality (lower is better quality, 0 is lossless)
//           "-preset",
//           "slow", // Use slow preset for better compression (higher quality at smaller file size)
//           "-movflags",
//           "+faststart", // Optimize for web playback
//         ])
//         .output(outputPath)
//         .on("end", resolve)
//         .on("error", reject)
//         .run();
//     });
//   } else {
//     throw new Error("Unsupported file type");
//   }

//   return outputPath;
// };

// export const uploadFile = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const fileType = req.file.mimetype;
//     const compressedFilePath = await processFile(req.file.path, fileType);

//     // Upload the compressed file to S3
//     const uploadParams = {
//       Bucket: process.env.BUCKET_NAME as string,
//       Key: `uploads/${Date.now()}_${path.basename(compressedFilePath)}`,
//       Body: fs.createReadStream(compressedFilePath),
//       ContentType: fileType,
//     };

//     const data = await s3.send(new PutObjectCommand(uploadParams));

//     // Clean up the temporary files
//     fs.unlinkSync(req.file.path); // Remove the original file
//     fs.unlinkSync(compressedFilePath); // Remove the compressed file

//     res.json({
//       message: "File uploaded and compressed successfully!",
//       url: `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`,
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).send("An error occurred during the upload.");
//   }
// };

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.json({
    message: "File uploaded successfully!",
    url: req.file.location,
  });
};
