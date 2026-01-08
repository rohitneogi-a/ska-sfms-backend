import express from "express";
import {registerAdmin,loginAdmin,getAdminProfile,getAllStudents} from "../controllers/admin.controller.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/profile").get(verifyAdmin, getAdminProfile);

// Admin Student Management
router.route("/allStudentsAdmin").get(verifyAdmin, getAllStudents);




export default router;