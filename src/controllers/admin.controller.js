import expressAsyncHandler from "express-async-handler";
import Admin from "../models/admin.model.js";
import {
  sendSuccess,
  sendError,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.utils.js";

import {constants, config } from "../../constants.js";

// Generate Access Token
const generateAccessToken = async (adminId) => {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error("Admin not found");
    const accessToken = admin.generateAccessToken();
    return accessToken;
}

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
            fullName : fullName.trim(),
            email: normalizedEmail,
            phoneNo: phoneNo.trim(),
            address: address.trim(),
            password,
        });
        return sendSuccess(
            res,
            constants.CREATED,
            "Admin registered successfully"
        );
    }catch (error) {
        return sendServerError(res, error);
    }
});