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
        required: true,
        trim: true,
        validate: [{
            validator: (value) => value.length > 0,
            message: 'Message con not be empty',
        },]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true,
})

const messageModel = mongoose.model("messageData", messageSchema);
module.exports = messageModel;