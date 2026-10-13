import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const getAllReviews = async (req, res) => {
  try {
    const filter = req.params.doctorId ? { doctor: req.params.doctorId } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, message: "Successful", data: reviews });
  } catch { res.status(500).json({ success: false, message: "Could not load reviews" }); }
};

export const createReview = async (req, res) => {
  const doctorId = req.params.doctorId;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    const review = await Review.create({ doctor: doctorId, user: req.userId, reviewText: req.body.reviewText, rating: Number(req.body.rating) });
    await Review.calcAverageRatings(doctorId);
    res.status(201).json({ success: true, message: "Review submitted", data: review });
  } catch (err) { res.status(500).json({ success: false, message: err.message || "Could not create review" }); }
};
