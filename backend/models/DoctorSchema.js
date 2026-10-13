import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: Number },
  photo: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female", "other"] },
  ticketPrice: { type: Number, min: 0, default: 0 },
  role: { type: String, enum: ["doctor"], default: "doctor" },
  specialization: { type: String, default: "" },
  qualifications: { type: Array, default: [] },
  experiences: { type: Array, default: [] },
  bio: { type: String, maxLength: 500, default: "" },
  about: { type: String, default: "" },
  timeSlots: { type: Array, default: [] },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  isApproved: { type: String, enum: ["pending", "approved", "cancelled"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
