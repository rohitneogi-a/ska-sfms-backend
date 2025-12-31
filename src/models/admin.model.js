import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../constants.js";

const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already registered"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^\+\d{1,4}\d{10}$/,
        "Please enter a valid phone number with country code", // Validates proper phone number format
      ],
      trim: true,
    },

    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//Password comparison
adminSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: "Admin",
    },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenExpiry || "1h" }
  );
};

export default mongoose.model("Admin", adminSchema);
