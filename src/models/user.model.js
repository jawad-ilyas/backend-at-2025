import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { JsonWebTokenError as jwt } from "jsonwebtoken";
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        watchVideo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }],
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);



userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema);
