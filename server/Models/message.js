const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userRegisteredData",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userRegisteredData",
        required: true,
    },
    message: {
        type: String,
        trim: true,
        validate: [{
            validator: (value) => value.length >= 0,
            message: 'Message con not be empty',
        },]
    },
    image: {
        type: String,
        trim: true,
        validate: [{
            validator: (value) => value.length >= 0,
            message: 'Message con not be empty',
        },]
    },
    video: {
        type: String,
        trim: true,
        validate: [{
            validator: (value) => value.length >= 0,
            message: 'Message con not be empty',
        },]
    },
    unActiveIds: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "userRegisteredData",
            default: [],
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
})

const messageModel = mongoose.model("messageData", messageSchema);
module.exports = messageModel;