const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
    },

    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
    },

    bio: {
        type: String,
        default: "",
    },

    city: {
        type: String,
        default: "",
    },
    
    contact: {
        type: String,
        default: "",
    },

    state: {
        type: String,
        default: "",
    },

    pincode: {
        type: String,
        default: "",
    },

    profilePic:{
        type: String,
        default: "",
    },

    profilePicPublicId: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["Paid", "Pending", "Failed"],
        default: "Pending"
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null,
    },

})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel