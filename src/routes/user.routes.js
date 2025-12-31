import {Router} from "express";
import {registerUser,loginUser} from "../controllers/user.controllers.js"

import { getProfile } from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";


const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


export default router;