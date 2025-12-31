import express from "express";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

// Remove registration route
// router.post("/register", register);
// router.post("/login", login);

export default router;
