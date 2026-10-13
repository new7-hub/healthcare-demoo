import express from "express";
import {
  updateUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments,
} from "../Controllers/userControllers.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Specific paths must come before /:id.
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);
router.get("/appointments/my-appointments", authenticate, restrict(["patient"]), getMyAppointments);
router.get("/", authenticate, restrict(["admin"]), getAllUser);
router.get("/:id", authenticate, restrict(["patient", "admin"]), getSingleUser);
router.put("/:id", authenticate, restrict(["patient", "admin"]), updateUser);

export default router;
