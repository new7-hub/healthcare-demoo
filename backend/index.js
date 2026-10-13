import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const clientSiteUrl = process.env.CLIENT_SITE_URL || "http://localhost:5173";
const allowedOrigins = new Set([clientSiteUrl, "http://localhost:5173", "http://127.0.0.1:5173"]);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  return callback(new Error("CORS origin not allowed"));
}, credentials: true }));

app.get("/", (_req, res) => res.status(200).send("Api is working"));
app.get("/api/v1/health", (_req, res) => res.json({ success: true, message: "API is healthy" }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

const connectDB = async () => {
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is missing in .env");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB database is connected");
};

const start = async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => console.log(`Server is running on port: ${port}`));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

start();
