import { asyncHandler } from "../utilis/asyncHandler.utilis.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utilis/ApiError.uitilis.js";
import { ApiResponse } from "../utilis/ApiResponse.utilis.js";
import uploadCloudinary from "../utilis/cloudinary.utilis.js";

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


    const { email, password } = req.body
    console.log('====================================');
    // console.log("email", email);
    console.log("userName", req.body);
    // console.log("password", password);
   
    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError(404, "fields are requried ")
    }

    const user = User.findOne({
        email
    })

    const verifyUser = User.findById(user?.id).select("-password")

    if (!verifyUser) {
        throw new ApiError(404, "user is not found")
    }

    res.status(200).json(new ApiResponse(200, verifyUser))

})


export { registerUser, loginUser }

