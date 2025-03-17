const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegisteredData",
            required: true
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messageData",
            default: [],
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messageData",
        default: null,
    },
    blockedIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegisteredData",
            default: [],
        }
    ],
},
    {
        timestamps: true,
    }
);

const conversationModel = mongoose.model("conversationData", conversationSchema);
module.exports = conversationModel;