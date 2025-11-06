import { asyncHandler } from "../utilis/asyncHandler.utilis.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utilis/ApiError.uitilis.js";
import { ApiResponse } from "../utilis/ApiResponse.utilis.js";
import uploadCloudinary from "../utilis/cloudinary.utilis.js";
import jwt from "jsonwebtoken";
const generatingAccessAndRefreshToken = async (userId) => {

    console.log('====================================');
    console.log("user id into access and refrehs token ", userId);
    console.log('====================================');
    // console.log('====================================');
    // console.log("user id into access and refrehs token ", user);
    // console.log('====================================');
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateAccessToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        console.log('====================================');
        console.log("error into generating access and refresht token ");
        console.log('====================================');
    }
}











const registerUser = asyncHandler(async (req, res) => {

    // get user details from the user 


    const { email, userName, password, fullName } = req.body;
    //  validataion  - not empty 

    console.log("req?.files?.coverImage[0]?.path ", req?.files?.coverImage?.[0]?.path);


    if ([email, userName, password, fullName].some((field) => {
        return field.trim() === ""
    })) {
        throw new ApiError(404, 'all is required field ')

    }
    console.log('====================================');
    console.log("email", email);
    console.log("userName", userName);
    console.log("password", password);
    console.log("fullName", fullName);
    console.log('====================================');

    // check if user is already exist or not 

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    console.log("existedUser", existedUser);

    if (existedUser) {
        throw new ApiError(409, 'user is elready exists  ')

    }

    // check for images , check for avatar 

    // files get from the multer 
    const avatarLocalPath = req?.files?.avatar?.[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image is required ")
    }

    // upload them to cloudinary 

    const avatar = await uploadCloudinary(avatarLocalPath);
    console.log('====================================');
    console.log("avatar image ", avatar);
    console.log('====================================');
    if (!avatar) {
        throw new ApiError(400, "avatar image is required ")
    }
    const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;
    let coverImage = "";
    if (coverImageLocalPath !== null) {
        coverImage = await uploadCloudinary(avatarLocalPath);
    }
    // create user object 


    const user = await User.create({
        email,
        userName,
        fullName,
        password,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || ""
    })
    // remove object from the res
    const createdUser = await User.findById(user?._id)
        .select("-password -refreshToken")
    // check for the user creation 
    if (!createdUser) {
        throw new ApiError(404, "user is not created ")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user register successfully ")
    )

})

const loginUser = asyncHandler(async (req, res) => {


    // get user data 
    // validate user data 
    // check user is exits 
    // remove fileds
    // return res


    const { email, password } = req.body;
    console.log('====================================');
    // console.log("email", email);
    console.log("req.body", req.body);
    // console.log("password", password);

    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError(404, "fields are requried ")
    }


    const user = await User.findOne({
        $or: [{ email }]
    })
    if (!user) {
        throw new ApiError(201, "email IS NOT VALID ")
    }

    console.log('====================================');
    console.log("user", user);
    console.log('====================================');

    const { accessToken, refreshToken } = await generatingAccessAndRefreshToken(user?._id);
    console.log('====================================');
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log('====================================');
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(201, "PASSWORD IS NOT VALID ")
    }

    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken")

    if (!loggedInUser) {
        throw new ApiError(404, "user is not found")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "user logged in "))

})

const logoutUser = asyncHandler(async (req, res) => {

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out "))

})


const refreshAccessToken = asyncHandler(async (req, res) => {

    const incompingRefreshToken = req?.cookies?.refreshToken || req?.header("Authorization")?.replace("Bearer ", "")
    console.log("incompingRefreshToken", incompingRefreshToken);

    if (!incompingRefreshToken) {
        throw new ApiError(404, "token is not found ")
    }

    const decodedToken = jwt.verify(incompingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    console.log("user into refresh access token fun :: ", decodedToken);

    const user = await User.findById(decodedToken?._id)
    console.log("user into refresh access token fun :: ", user);

    if (!user) {
        throw new ApiError(404, "user is not found ")
    }
    if (incompingRefreshToken !== user?.refreshToken) {
        throw new ApiError(404, "token  is not found ")
    }
    const { accessToken, refreshToken } = await generatingAccessAndRefreshToken(user?._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "token again generated  "))

})

export { registerUser, loginUser, logoutUser, refreshAccessToken }

