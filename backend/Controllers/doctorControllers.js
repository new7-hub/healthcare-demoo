import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

const publicDoctor = (doctor) => {
  if (!doctor) return null;
  const obj = doctor.toObject ? doctor.toObject() : doctor;
  delete obj.password;
  return obj;
};

export const updateDoctor = async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ success: false, message: "You can only update your own profile" });
  const allowed = ["name", "phone", "photo", "bio", "gender", "specialization", "ticketPrice", "qualifications", "experiences", "timeSlots", "about"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Successfully updated", data: doctor });
  } catch (err) { res.status(500).json({ success: false, message: "Failed to update doctor" }); }
};

export const deleteDoctor = async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ success: false, message: "You can only delete your own profile" });
  try { await Doctor.findByIdAndDelete(req.params.id); res.json({ success: true, message: "Successfully deleted" }); }
  catch { res.status(500).json({ success: false, message: "Failed to delete" }); }
};

export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("reviews").select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "No doctor found" });
    res.json({ success: true, message: "Doctor found", data: doctor });
  } catch { res.status(400).json({ success: false, message: "Invalid doctor id" }); }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    const filter = { isApproved: "approved" };
    if (query) filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { specialization: { $regex: query, $options: "i" } },
    ];
    const doctors = await Doctor.find(filter).select("-password");
    res.json({ success: true, message: "Doctors found", data: doctors });
  } catch { res.status(500).json({ success: false, message: "Could not load doctors" }); }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.userId).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    const appointments = await Booking.find({ doctor: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, message: "Profile info is getting", data: { ...publicDoctor(doctor), appointments } });
  } catch (err) { res.status(500).json({ success: false, message: "Something went wrong, cannot get profile" }); }
};
