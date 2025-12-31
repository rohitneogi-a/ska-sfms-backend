import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { config } from "../../constants.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Moderator from "../models/moderator.model.js";
import { sendServerError, sendUnauthorized } from "../utils/response.utils.js";

export const verifyUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendUnauthorized(res);
    }

    let varifyInfo;
    try {
      varifyInfo = jwt.verify(token, config.accessTokenSecret);
    } catch (error) {
      return sendUnauthorized(res);
    }

    if (varifyInfo?.role !== "User") {
      return sendUnauthorized(res);
    }

    const user = await User.findById(varifyInfo._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return sendUnauthorized(res);
    }

    req.user = { ...user.toObject(), role: varifyInfo.role };
    next();
  } catch (error) {
    return sendServerError(res);
  }
});

export const verifyAdmin = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendUnauthorized(res);
    }

    let varifyInfo;
    try {
      varifyInfo = jwt.verify(token, config.accessTokenSecret);
    } catch (error) {
      return sendUnauthorized(res);
    }

    if (varifyInfo?.role !== "Admin") {
      return sendUnauthorized(res);
    }
    
    const admin = await Admin.findById(varifyInfo._id).select("-password -accessToken");

    if (!admin) {
        return sendUnauthorized(res);
    }
    req.admin = { ...admin.toObject(), role: varifyInfo.role };
    next(); 
    
  } catch (error) {
    return sendServerError(res);
    
  }
});

export const varifyModerator =  expressAsyncHandler(async (req,res,next) =>{
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendUnauthorized(res);
    }

    let varifyInfo;
    try {
      varifyInfo = jwt.verify(token, config.accessTokenSecret);
    } catch (error) {
      return sendUnauthorized(res);
    }
    
    if (varifyInfo?.role !== "Moderator") {
      return sendUnauthorized(res);
    }

    const moderator = await Moderator.findById(
      varifyInfo._id
    ).select("-password -accessToken");

    if (!moderator) {
      return sendUnauthorized(res);
    }

    req.moderator = { ...moderator.toObject(), role: varifyInfo.role };

    next();


  } catch (error) {
    return sendServerError(res);
    
  }
})