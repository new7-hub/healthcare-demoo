import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ticketPrice: { type: Number, required: true },
  session: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "approved", "cancelled"], default: "pending" },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

BookingSchema.pre(/^find/, function(next) {
  this.populate("user", "name email photo gender").populate({ path: "doctor", select: "name photo specialization ticketPrice averageRating totalRating experiences isApproved" });
  next();
});

export default mongoose.model("Booking", BookingSchema);
