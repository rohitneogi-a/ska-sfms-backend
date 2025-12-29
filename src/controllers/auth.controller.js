import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      guardianName,
      phoneno,
      password,
      dob,
      subject,
      address,
      role,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !guardianName ||
      !phoneno ||
      !password ||
      !dob ||
      !subject ||
      !address
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate role
    const validRoles = ["USER", "MODERATOR", "ADMIN"];
    const userRole = validRoles.includes(role) ? role : "USER";

    // Check if user already exists
    const existingUser = await User.findOne({ phoneno });
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
      role: userRole,
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

export const login = async (req,res)=>{
  try {
    const {phoneno, password} = req.body;

    // Find the user by phone number
    const user =  await User.findOne({
      phoneno,
    });
    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Compare the password
    const isMatch =  await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: "Invalid Password"
      });
    }
    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      
      user: {
        id: user._id,
        name: user.name,
        phoneno: user.phoneno,
        role: user.role
      },
      token,

    })
  } catch (error) {

    res.status(500).json({
      message: "Internal server error",
    })
  }
}
