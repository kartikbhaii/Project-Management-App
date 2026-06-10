import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"


const userSchema = new mongoose.Schema(
 {
    avatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: `https://placehold.co/200x200`,
            localPath: ""
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    }
  },
  {
    timestamps: true,
  },

)

// encrypting/hash the password before saving to mongoose so it doent save password as plain text: (called "pre Hook")

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
}) 

// checking if entered password is same as registered password

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// generating JWT ACCESS Token

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}


// generating JWT REFRESH Token 

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}


// temporary tokens (using crypto module) use for passwordReset

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
                        .createHash("sha256")
                        .update(unHashedToken)
                        .digest("hex")

    const tokenExpiry = Date.now() + (20*60*1000) // add 20 minutes

    return {unHashedToken, hashedToken, tokenExpiry}
}




export const User = mongoose.model("User", userSchema)