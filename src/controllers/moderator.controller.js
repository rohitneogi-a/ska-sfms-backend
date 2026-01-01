import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import Moderator from "../models/moderator.model.js";

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
    const { fullName, email, phoneNo, address } = req.body;

    if (!fullName || !email || !phoneNo || !address) {
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

    const password = generateRandomPassword();

    const newModerator = await Moderator.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNo: phoneNo.trim(),
      address: address.trim(),
      password,
    });

    const message = moderatorRegisterMessage(fullName, email, password);
    await sendEmail(email, "Moderator Account Created", message);

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
