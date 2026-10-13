import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: Number },
  photo: { type: String, default: "" },
  role: { type: String, enum: ["patient", "admin"], default: "patient" },
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodType: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
