import express from "express";
import {
  registerModerator,
  loginModerator,
  getModeratorProfile,addStudent,getStudents,deleteModerator
} from "../controllers/moderator.controller.js";
import {verifyUser,verifyAdmin,verifyModerator} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Moderator Routes

// Auth Routes
router.route("/register").post(verifyAdmin, registerModerator);
router.route("/login").post(loginModerator);
router.route("/profile").get(verifyModerator, getModeratorProfile);

// Student Management Routes
router.route("/addStudent").post(verifyModerator, addStudent);
router.route("/students").get(verifyModerator, getStudents);

// Delete Moderator (Admin only)
router.route("/deleteModerator/:id").delete(verifyAdmin,deleteModerator);


export default router;
