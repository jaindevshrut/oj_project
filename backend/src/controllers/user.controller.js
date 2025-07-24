import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) // isme validation nahi chaiye kyuki we know what we are doing
        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}


export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body
    if (
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }
    // Create new user
    const newUser = await User.create({
        username,
        fullName,
        email,
        password
    });
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went worng while creating a user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Credentials are required")
    }

    // Find user by email
    const username = email;
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax', // Add sameSite policy
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User logged in successfully")
        )
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from the document
            }
        },
        {
            new: true
        }
    )
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
    }
    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

export const checkAuth = asyncHandler(async (req, res) => {
    let token = null;

    // try cookie first, then Authorization header
    if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.header("Authorization")) {
        // fix typo “Brearer” → “Bearer ”
        token = req.header("Authorization").replace(/^Bearer\s+/i, "");
    }

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({ authenticated: true, user: decoded });
    } catch {
        return res.status(401).json({ authenticated: false });
    }
})