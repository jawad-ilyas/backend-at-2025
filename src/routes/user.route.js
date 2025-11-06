import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlerware/multer.middlerware.js";
import { verifyJwt } from "../middlerware/auth.middlerware.js";


const router = Router();


router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser)
router.route("/login").post(loginUser)


// secord route
router.route("/logout").post(verifyJwt, loginUser)



export default router;