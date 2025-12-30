import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import {config} from "../../constants.js";
import User from "../models/user.model.js";
import {sendServerError, sendUnauthorized} from "../utils/response.utils.js";



export const verifyUser  = expressAsyncHandler(async (req, res, next) =>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ","");

        if (!token){
            return sendUnauthorized(res);
        }

        let varifyInfo;
        try {
            varifyInfo = jwt.verify(token, config.accessTokenSecret);
        }catch(error){
            return sendUnauthorized(res);
        }

        if (varifyInfo?.role !=="USER") {
            return sendUnauthorized(res);
        }

        const user = await User.findById(varifyInfo._id).select(
            "-password -refreshToken"
        )

        if(!user){
            return sendUnauthorized(res);
        }

        req.user ={ ...user.toObject(), role: varifyInfo.role};
        next();
    }catch(error){
        return sendServerError(res);
    }
})
// export const authenticate = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer")){
//         return res.status(401).json({
//             message: "Unauthorized: No token provided"
//         })
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = {
//             id: decoded.id,
//             role: decoded.role,
//         };
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             message: "Unauthorized: Invalid token"
//         })
//     }
// }