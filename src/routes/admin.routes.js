import express from "express";
import {registerAdmin,loginAdmin,getAdminProfile} from "../controllers/admin.controller.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/profile").get(verifyAdmin, getAdminProfile);




export default router;