import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import Moderator from "../models/moderator.model.js";

import {
  sendSuccess,
  sendError,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.utils.js";

import {constants, config } from "../../constants.js";

import {
  moderatorRegisterMessage,
  sendEmail,
} from "../utils/mailer.utils.js";
import jwt from "jsonwebtoken";


// Generate Access Token
const generateAccessToken = async (moderatorId) => {
  const moderator = await Moderator.findById(moderatorId);
  if (!moderator) throw new Error("Moderator not found");
  const accessToken = moderator.generateAccessToken();
  return accessToken;
}

// Moderator Registration
export const registerModerator = expressAsyncHandler(async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
})
