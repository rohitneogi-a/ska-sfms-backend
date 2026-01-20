import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/user.model.js"; 

import {
  sendSuccess,
  sendError,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.utils.js";

import { constants, config } from "../../constants.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const accessToken = user.generateAccessToken();
  return accessToken;
};

//
export const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const { fullName, guardianName, phoneNo, password, dob, subject, address, gender } =
      req.body;

    if (
      !fullName ||
      !guardianName ||
      !phoneNo ||
      !password ||
      !dob ||
      !subject ||
      !address ||
      !gender
    ) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "All fields are required"
      );
    }

    const normalizedPhoneNo = phoneNo.trim();

    // Check if the user already exists
    const existingUser = await User.findOne({ phoneNo: normalizedPhoneNo });

    if (existingUser) {
      return sendError(
        res,
        constants.CONFLICT,
        "User with this phone number already exists"
      );
    }

    const newUser = await User.create({
      fullName: fullName.trim(),
      guardianName: guardianName.trim(),
      phoneNo: normalizedPhoneNo,
      password,
      dob,
      subject: subject.trim(),
      address: address.trim(),
      gender,
    });

    // Remove sensitive fields before sending
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      guardianName: newUser.guardianName,
      phoneNo: newUser.phoneNo,
      dob: newUser.dob,
      subject: newUser.subject,
      address: newUser.address,
      gender: newUser.gender,
      profileImage: newUser.profileImage,
      paymentStatus: newUser.paymentStatus,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return sendSuccess(res, constants.CREATED, "User registered successfully", userResponse);
  } catch (error) {
    sendServerError(res, error);
  }
});

export const loginUser = expressAsyncHandler(async (req, res) => {
  try {
    const { phoneNo, password } = req.body;

    if (!phoneNo || !password) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Phone number and password are required"
      );
    }

    const user = await User.findOne({ phoneNo });

    if (!user) {
      return sendError(res, constants.NOT_FOUND, "User not found");
    }

    if (!(await user.isPasswordMatch(password))) {
      return sendError(res, constants.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = user.generateAccessToken();

    return sendSuccess(res, constants.OK, "Login successful", { accessToken });
  } catch (error) {
    return sendServerError(res, error);
  }
});

export const getProfile = expressAsyncHandler(async (req, res) => {
  try {
    let user = req.user;

    return sendSuccess(
      res,
      constants.OK,
      "User profile fetched successfully",
      { user }
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});
