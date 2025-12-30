import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    guardianName: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    profileImage :{
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    },

    role: {
      type: String,
      enum: ["USER", "MODERATOR", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
