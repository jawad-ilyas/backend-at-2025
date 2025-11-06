import { User } from "../models/user.model.js";
import { ApiError } from "../utilis/ApiError.uitilis.js";
import { asyncHandler } from "../utilis/asyncHandler.utilis.js";
import jwt from "jsonwebtoken"

const verifyJwt = asyncHandler(async (req, res, next) => {

    try {
        console.log('====================================');
        // console.log(" req.cookie.accessToken", req.cookie.accessToken);
        console.log('====================================');
        const token = req?.cookie?.accessToken || req?.header("Authorization")?.replace("Bearer ", "")
        console.log('====================================');
        console.log(" token", token);
        console.log('====================================');
        if (!token)
            throw new ApiError(401, "unauthorized access")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user)
            throw new ApiError(401, "Invlaid access token ")

        req.user = user;

        next();
    } catch (error) {
        console.log("erorr into auth middlerware ", error);

    }
})


export { verifyJwt }