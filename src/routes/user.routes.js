import express from "express";

import { getProfile } from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";


const router = express.Router();


router.get(
  "/profile",
  authenticate,
  authorize("USER", "MODERATOR", "ADMIN"),
  getProfile
);

export default router;