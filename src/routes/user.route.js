import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlerware/multer.middlerware.js";
import { verifyJwt } from "../middlerware/auth.middlerware.js";


const router = Router();


router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser)
router.route("/login").post(loginUser)


// secord route
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refreshAccessToken").post(refreshAccessToken)



export default router;