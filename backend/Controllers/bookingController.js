import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

const stripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is missing in backend/.env");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export const getCheckoutSession = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    if (!user) return res.status(404).json({ success: false, message: "Patient not found" });
    if (doctor.isApproved !== "approved") return res.status(400).json({ success: false, message: "Doctor is not approved for booking" });
    if (!Number.isFinite(Number(doctor.ticketPrice)) || Number(doctor.ticketPrice) <= 0) return res.status(400).json({ success: false, message: "Doctor ticket price is not configured" });

    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL || "http://localhost:5173"}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_SITE_URL || "http://localhost:5173"}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: doctor.id,
      metadata: { userId: user.id, doctorId: doctor.id },
      line_items: [{ price_data: { currency: "inr", unit_amount: Math.round(Number(doctor.ticketPrice) * 100), product_data: { name: doctor.name, description: doctor.bio || "Medical consultation", ...(doctor.photo ? { images: [doctor.photo] } : {}) } }, quantity: 1 }],
    });

    await Booking.create({ doctor: doctor._id, user: user._id, ticketPrice: Number(doctor.ticketPrice), session: session.id, isPaid: false });
    res.json({ success: true, message: "Checkout session created", session });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ success: false, message: err.message || "Error creating checkout session" });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    if (session.metadata?.userId !== req.userId) return res.status(403).json({ success: false, message: "This checkout does not belong to you" });
    if (session.payment_status !== "paid") return res.status(400).json({ success: false, message: "Payment has not been completed" });
    const booking = await Booking.findOneAndUpdate({ session: session.id, user: req.userId }, { $set: { isPaid: true } }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Payment verified", data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message || "Could not verify payment" }); }
};
