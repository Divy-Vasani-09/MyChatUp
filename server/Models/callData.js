const mongoose = require("mongoose");

const callDataSchema = mongoose.Schema({
    caller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userRegisteredData",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userRegisteredData",
        required: true,
    },
    callType: {
        type: String,
        enum: ["voice", "video"], 
        required: true,
    },
    status: {
        type: String,
        enum: ["ringing", "ongoing", 'missed', 'completed', 'declined'],
        required: true,
    },
    startedAt: {
        type: Date,
    },
    endedAt: {
        type: Date,
    },
    duration: {
        type: Number,
    }
}, {
    timestamps: true,
})

const callDataModel = mongoose.model("callData", callDataSchema);
module.exports = callDataModel;