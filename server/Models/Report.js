const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reporterId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegisteredData",
            required: true
        }
    ],
    reportedId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegisteredData",
            required: true
        }
    ],
    lastFiveMessageIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messageData",
            required: true,
        }
    ],
    reportMessage: {
        type: String,
        trim: true,
        required: true,
        default: "",
    },
},
    {
        timestamps: true,
    }
);

const reportModel = mongoose.model("reportData", reportSchema);
module.exports = reportModel;