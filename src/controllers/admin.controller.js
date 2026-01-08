import expressAsyncHandler from "express-async-handler";
import Admin from "../models/admin.model.js";
import Moderator from "../models/moderator.model.js";
import {
  sendSuccess,
  sendError,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.utils.js";
import User from "../models/user.model.js";

import { constants, config } from "../../constants.js";
import { adminRegisterMessage, sendEmail } from "../utils/mailer.utils.js";

// Generate Access Token
const generateAccessToken = async (adminId) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("Admin not found");
  const accessToken = admin.generateAccessToken();
  return accessToken;
};

// Admin Registration
export const registerAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { fullName, email, phoneNo, address, password } = req.body;
    if (!fullName || !email || !phoneNo || !address || !password) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "All fields are required"
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email: normalizedEmail }, { phoneNo }],
    });
    if (existingAdmin) {
      return sendError(
        res,
        constants.CONFLICT,
        "Admin with this email or phone number already exists"
      );
    }

    await Admin.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNo: phoneNo.trim(),
      address: address.trim(),
      password,
    });
    // const message = adminRegisterMessage(fullName, normalizedEmail, password);
    // await sendEmail(
    //   normalizedEmail,
    //   "Admin Account Created",
    //   message
    // );

    return sendSuccess(res, constants.CREATED, "Admin registered successfully");
  } catch (error) {
    return sendServerError(res, error);
  }
});

// Admin Login
export const loginAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Email and password are required"
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return sendError(
        res,
        constants.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isValid = await admin.isPasswordMatch(password);
    if (!isValid) {
      return sendError(
        res,
        constants.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const accessToken = await generateAccessToken(admin._id);
    return sendSuccess(res, constants.OK, "Login successful", {
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phoneNo: admin.phoneNo,
        address: admin.address,
      },
      accessToken,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
});

// Get Admin Profile
export const getAdminProfile = expressAsyncHandler(async (req, res) => {
  try {
    const admin = req.admin;

    return sendSuccess(
      res,
      constants.OK,
      "Admin profile fetched successfully",
      admin
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

// Get All Students
export const getAllStudents = expressAsyncHandler(async (req, res) => {
  try {
    const students = await User.find({
      createdByModel: { $ne: "Moderator" },
    })
      .select("-password -accessToken")
      .populate("createdBy", "fullName  phoneNo ");

    return sendSuccess(
      res,
      constants.OK,
      "Students fetched successfully",
      students
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

// get All Moderators
export const getAllModerators = expressAsyncHandler(async (req, res) => {
  try {
    const moderators = await Moderator.find({}).select(
      "-password -accessToken"
    );

    return sendSuccess(
      res,
      constants.OK,
      "Moderators fetched successfully",
      moderators
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});
