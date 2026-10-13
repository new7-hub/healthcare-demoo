import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const ReviewSchema = new mongoose.Schema({
  doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  reviewText: { type: String, required: true, trim: true, maxlength: 1000 },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

ReviewSchema.pre(/^find/, function(next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});

ReviewSchema.statics.calcAverageRatings = async function(doctorId) {
  const stats = await this.aggregate([
    { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
    { $group: { _id: "$doctor", numOfRating: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
  ]);
  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0]?.numOfRating || 0,
    averageRating: Number((stats[0]?.avgRating || 0).toFixed(1)),
  });
};

ReviewSchema.post("save", function() { this.constructor.calcAverageRatings(this.doctor).catch(() => {}); });
export default mongoose.model("Review", ReviewSchema);
