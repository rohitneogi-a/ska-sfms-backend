import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import Moderator from "../models/moderator.model.js";
import User from "../models/user.model.js"; 

import {
  sendSuccess,
  sendError,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.utils.js";

import { constants, config } from "../../constants.js";

import { generateRandomPassword } from "../utils/generateRandomPassword.utils.js";

import { moderatorRegisterMessage, sendEmail } from "../utils/mailer.utils.js";
import jwt from "jsonwebtoken";

// Generate Access Token
const generateAccessToken = async (moderatorId) => {
  const moderator = await Moderator.findById(moderatorId);
  if (!moderator) throw new Error("Moderator not found");
  const accessToken = moderator.generateAccessToken();
  return accessToken;
};

// Moderator Registration
export const registerModerator = expressAsyncHandler(async (req, res) => {
  try {
    const { fullName, email, phoneNo, address, password } = req.body;

    if (!fullName || !email || !phoneNo || !address || !password) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "All fields are required for registration"
      );
    }

    const existingModerator = await Moderator.findOne({
      $or: [{ email: email.trim() }, { phoneNo: phoneNo.trim() }],
    });

    if (existingModerator) {
      return sendError(
        res,
        constants.CONFLICT,
        "Moderator with this email or phone number already exists"
      );
    }

    const newModerator = await Moderator.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNo: phoneNo.trim(),
      address: address.trim(),
      password: password,
    });

    // const message = moderatorRegisterMessage(fullName, email, password);
    // await sendEmail(email, "Moderator Account Created", message);

    return sendSuccess(
      res,
      constants.CREATED,
      "Moderator registered successfully",
      newModerator
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

// Moderator Login
export const loginModerator = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(
      res,
      constants.VALIDATION_ERROR,
      "Email and password are required"
    );
  }

  const moderator = await Moderator.findOne({ email });
  if (!moderator) {
    return sendError(res, constants.UNAUTHORIZED, "Invalid email or password");
  }

  const isMatch = await moderator.isPasswordMatch(password);
  if (!isMatch) {
    return sendError(res, constants.UNAUTHORIZED, "Invalid email or password");
  }

  const accessToken = await generateAccessToken(moderator._id);

  // Save token to moderator document
  moderator.accessToken = accessToken;
  await moderator.save();

  const moderatorData = {
    _id: moderator._id,
    fullName: moderator.fullName,
    email: moderator.email,
    phoneNo: moderator.phoneNo,
    address: moderator.address,
    profileImage: moderator.profileImage,
  };

  return sendSuccess(res, constants.OK, "Login successful", {
    moderator: moderatorData,
    accessToken,
  });
});

// Moderator Profile
export const getModeratorProfile = expressAsyncHandler(async(req,res) =>{
  try {
    const moderator = req.moderator;

    // Exclude sensitive fields
    const moderatorData = {
      _id: moderator._id,
      fullName: moderator.fullName,
      email: moderator.email,
      phoneNo: moderator.phoneNo,
      address: moderator.address,
      profileImage: moderator.profileImage,
      createdAt: moderator.createdAt,
      updatedAt: moderator.updatedAt
    };

    return sendSuccess(
      res,
      constants.OK,
      "Moderator profile fetched successfully",
      { moderator: moderatorData }
    );
  } catch (error) {
    return sendServerError(res, error);
  }
})

// Add Student (by Moderator)
export const addStudent = expressAsyncHandler(async (req, res)=>{
  try {
    const {
      fullName,
      guardianName,
      phoneNo,
      password,
      dob,
      subject,
      address, 
    } = req.body;

    if (!fullName || !guardianName || !phoneNo || !password || !dob || !subject || !address){
      return sendError(res, constants.VALIDATION_ERROR, "All fields are required to add a student");
    }
    
    const existing = await User.findOne({phoneNo: phoneNo.trim()});
    if (existing){
      return sendError(res, constants.CONFLICT, "A student with this phone number already exists");
    }

    const newUser = await User.create({
      fullName: fullName.trim(),
      guardianName: guardianName.trim(),
      phoneNo: phoneNo.trim(),
      password,
      dob,
      subject: subject.trim(),
      address: address.trim(),
      createdBy: req.moderator._id,
      createdByModel: "Moderator"
    });
    
    return sendSuccess(res, constants.CREATED, "Student added successfully", newUser);

  } catch (error) {
    return sendServerError(res, error);
  }
});

// Get Moderator Students

export const  getStudents = expressAsyncHandler(async (req, res)=>{
  try {
    const students = await User.find({
      createdBy: req.moderator._id,
    }).select("-password -accessToken");

    return sendSuccess(
      res,
      constants.OK,
      "Students fetched successfully",
       students 
    )
  } catch (error) {
    return sendServerError(res, error);
  }
})


// Delete Moderator
export const  deleteModerator = expressAsyncHandler(async (req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      return sendError(res, constants.VALIDATION_ERROR, "Moderator ID is required");
    }

    const moderator = await Moderator.findById(id);
    if(!moderator){
      return sendError(res, constants.NOT_FOUND, "Moderator not found");
    }

    await User.deleteMany({createdBy: moderator._id});

    await Moderator.findByIdAndDelete(id);

    return sendSuccess(res, constants.OK, "Moderator and associated students deleted successfully");


  } catch (error) {
    
    return sendServerError(res, error);
  }
})