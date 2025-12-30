import express from "express";

import { getProfile } from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";


const router = express.Router();


router.get(
  "/profile",
  verifyUser,
  authorize("USER", "MODERATOR", "ADMIN"),
  getProfile
);

export default router;