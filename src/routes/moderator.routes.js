import express from "express";
import {
  registerModerator,
  loginModerator
} from "../controllers/moderator.controller.js";
import {verifyUser,verifyAdmin,varifyModerator} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(verifyAdmin, registerModerator);
router.route("/login").post(loginModerator);

export default router;
