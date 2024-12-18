require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import services from "./routes/services";
import mongoose from "mongoose";
import errorMiddleWare from "./utils/middlewares/errorMiddleWare";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
// Create an HTTP server
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server);
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5009;
const URI = process.env.MONGODB_URI;
mongoose.connect(`${URI}`).then(() => console.log("Connected!"));

app.use("/", services(io));

app.use(errorMiddleWare);

io.on("connection", (socket) => {
  console.log("a user connected");
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
