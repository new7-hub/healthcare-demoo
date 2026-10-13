import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { getCheckoutSession, verifyCheckoutSession } from "../Controllers/bookingController.js";

const router = express.Router();
router.post("/checkout-session/:doctorId", authenticate, restrict(["patient"]), getCheckoutSession);
router.get("/verify/:sessionId", authenticate, restrict(["patient"]), verifyCheckoutSession);
export default router;
