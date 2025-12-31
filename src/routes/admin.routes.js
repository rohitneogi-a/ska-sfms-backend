import express from "express";
import {registerAdmin} from "../controllers/admin.controller.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerAdmin);




export default router;