import express from "express";
import {
  registerModerator,
} from "../controllers/moderator.controller.js";
import {verifyUser,verifyAdmin,varifyModerator} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(verifyAdmin, registerModerator);

export default router;
