
import Auth from "../models/auth.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from "bcrypt";
import Advertisement from "../models/advertisement.model.js";
import Brand from "../models/brand.model.js";
import DoctorAdvice from "../models/doctorAdvice.model.js";
import Generic from "../models/generic.model.js";
import Leader from "../models/leader.model.js";
import MedicalTest from "../models/medicalTest.model.js";
import News from "../models/news.model.js";
import Pharmaceutical from "../models/pharmaceutical.model.js";
import TrustedCenter from "../models/trustedCenter.model.js";

export const Signup = async (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;
  if (
    !name ||
    name.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === "" ||
    !confirmPassword ||
    confirmPassword.trim() === ""
  ) {
    return sendResponse(res, 400, false, "All fields are required", null);
  }

  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailregex.test(email)) {
    return sendResponse(res, 400, false, "Invalid email", null);
  }

  if (password !== confirmPassword) {
    return sendResponse(res, 400, false, "Password do not match", null);
  }

  if (password.length < 6) {
    return sendResponse(
      res,
      400,
      false,
      "Password must be atleast 6 characters long",
      null
    );
  }

  try {
    const existingEmail = await Auth.findOne({ email });
    if (existingEmail) {
      return sendResponse(res, 400, false, "Email is already used", null);
    }

    const newUser = await Auth.create({
      name,
      email,
      password,
      role,
    });

    sendToken(newUser, 201, "Signup successful", res);
  } catch (error) {
    console.error("Error in Signup controller", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found", null);
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return sendResponse(
        res,
        400,
        false,
        "Incorrect email or password. Please try again",
        null
      );
    }

    sendToken(user, 200, "Login successful", res);
  } catch (error) {
    console.error("Error in Login controller", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
export const GetMe = (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Error in GetMe controller", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
export const Logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("eMedsHubToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};


export const Analytics = async (req, res) => {
  try {
    // Fetch all counts in parallel (fastest way)
    const [
      totalAdvertisement,
      totalBrand,
      totalDoctorAdvice,
      totalGeneric,
      totalLeader,
      totalMedicalTest,
      totalNews,
      totalPharmaceutical,
      totalTrustedCenter,
    ] = await Promise.all([
      Advertisement.countDocuments(),
      Brand.countDocuments(),
      DoctorAdvice.countDocuments(),
      Generic.countDocuments(),
      Leader.countDocuments(),
      MedicalTest.countDocuments(),
      News.countDocuments(),
      Pharmaceutical.countDocuments(),
      TrustedCenter.countDocuments(),
    ]);

    // Send structured response
    return sendResponse(res, 200, true, "Analytics fetched successfully", {
      totalAdvertisement,
      totalBrand,
      totalDoctorAdvice,
      totalGeneric,
      totalLeader,
      totalMedicalTest,
      totalNews,
      totalPharmaceutical,
      totalTrustedCenter,
    });
  } catch (error) {
    console.error("Error in Analytics controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};