import express from "express";
import mongoose from "mongoose";
import { userRoute } from "./routes/user.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import channelRoute from "./routes/chennel.route.js";
import { commentRoutr } from "./routes/comment.route.js";
import { vedioRoute } from "./routes/video.route.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
        "https://your-deployment-url.com",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello");
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Register routes
userRoute(app);
channelRoute(app);
commentRoutr(app);
vedioRoute(app);
