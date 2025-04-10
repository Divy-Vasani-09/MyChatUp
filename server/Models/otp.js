const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    } // Auto-delete after 5 min
});

const otpModel = mongoose.model("OTP", otpSchema);

module.exports = otpModel;