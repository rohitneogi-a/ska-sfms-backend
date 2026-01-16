import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllStudents,
  getAllModerators,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { getUserPayments } from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/profile").get(verifyAdmin, getAdminProfile);

// Admin Student Management
router.route("/allStudentsAdmin").get(verifyAdmin, getAllStudents);

// Admin Moderator Management
router.route("/allModerators").get(verifyAdmin, getAllModerators);

router.route("/:id/payments").get(verifyAdmin, getUserPayments);

export default router;
