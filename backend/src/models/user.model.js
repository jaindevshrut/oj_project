import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    accType: {
        type: String,
        required: true,
        enum: ["User", "Admin"]
    },
    avatar: {
        type: String,
        default: "https://www.svgrepo.com/show/452030/avatar-default.svg"
    },
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    Gender: {
        type: String,
        default: "N",
        enum: ["M", "F", "O", "N"],
        required: [true, 'Please select gender']
    },
    Location: {
        type: String,
    },
    website: {
        type: String,
    },
    username: {
        type: String,
        required: [true, "Please enter username"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }]

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            acctype: this.acctype,
        },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}


const User = mongoose.model('User', userSchema)

export default User