import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../constants.js"; 
const userSchema = new Schema(
  {
    fullName: {
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
    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    },
    accessToken :{
        type: String,
    },
    createdBy: {
      type : mongoose.Schema.Types.ObjectId,
      refPath : "createdByModel"
    },
    createdByModel: {
      type : String,
      enum : ["Admin", "Moderator"]
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    }

  },
  { timestamps: true }
);

//Hash the password before saving the user model
userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Check if the provided password matches the hashed password
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate an access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phoneNo: this.phoneNo,
      role: "User",
    },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenExpiry || "1h" }
  );
};

export default mongoose.model("User", userSchema);