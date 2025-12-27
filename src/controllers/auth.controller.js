import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, guardianName, phoneno, password, dob, subject, address, role } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      phoneno,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this phone number already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      name,
      guardianName,
      phoneno,
      password: hashedPassword,
      dob,
      subject,
      address,
      role : role || "USER",
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
