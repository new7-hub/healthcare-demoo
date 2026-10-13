import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
  if (req.userId !== req.params.id && req.role !== "admin") return res.status(403).json({ success: false, message: "You can only update your own profile" });
  const allowed = ["name", "phone", "photo", "gender", "bloodType"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Successfully updated", data: user });
  } catch (err) { res.status(500).json({ success: false, message: "Failed to update user" }); }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "No user found" });
    res.json({ success: true, message: "User found", data: user });
  } catch { res.status(400).json({ success: false, message: "Invalid user id" }); }
};

export const getAllUser = async (_req, res) => {
  try { const users = await User.find({}).select("-password"); res.json({ success: true, message: "Users found", data: users }); }
  catch { res.status(500).json({ success: false, message: "Could not load users" }); }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Profile info is getting", data: user });
  } catch { res.status(500).json({ success: false, message: "Something went wrong, cannot get profile" }); }
};

export const getMyAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).sort({ createdAt: -1 });
    const doctors = bookings.map((booking) => booking.doctor).filter(Boolean);
    res.json({ success: true, message: "Appointments are getting", data: doctors });
  } catch { res.status(500).json({ success: false, message: "Something went wrong, cannot get appointments" }); }
};
