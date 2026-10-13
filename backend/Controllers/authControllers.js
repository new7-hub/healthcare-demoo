import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret || secret === "REPLACE_WITH_A_LONG_RANDOM_SECRET") {
    throw new Error("JWT_SECRET_KEY is missing or still using the example placeholder. Set a private random secret in backend/.env and restart the backend.");
  }
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    secret,
    { expiresIn: "15d" }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo = "", gender } = req.body;
  if (!email || !password || !name || !["patient", "doctor"].includes(role)) {
    return res.status(400).json({ success: false, message: "Name, email, password and a valid role are required" });
  }
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Promise.all([User.findOne({ email: normalizedEmail }), Doctor.findOne({ email: normalizedEmail })]);
    if (existing.some(Boolean)) return res.status(400).json({ success: false, message: "User already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const Model = role === "doctor" ? Doctor : User;
    await Model.create({ name: name.trim(), email: normalizedEmail, password: passwordHash, photo, gender, role });
    res.status(201).json({ success: true, message: "User successfully created" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Internal server error, try again" });
  }
};

export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
  try {
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const user = patient || doctor;
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user);
    const data = user.toObject();
    delete data.password;
    delete data.appointments;
    res.status(200).json({ success: true, status: true, message: "Successfully logged in", token, data, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    const message = err.message?.includes("JWT_SECRET_KEY")
      ? err.message
      : "Login failed due to a server error. Check the backend terminal logs.";
    res.status(500).json({ success: false, status: false, message });
  }
};
