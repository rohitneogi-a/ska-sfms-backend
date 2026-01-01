import express from "express";
import {
  registerModerator,
  loginModerator,
  getModeratorProfile
} from "../controllers/moderator.controller.js";
import {verifyUser,verifyAdmin,verifyModerator} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(verifyAdmin, registerModerator);
router.route("/login").post(loginModerator);
router.route("/profile").get(verifyModerator, getModeratorProfile);

export default router;
