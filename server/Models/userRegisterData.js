const mongoose = require("mongoose");

const useRegisterSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        trim: true
    },
    EmailID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    PhoneNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        required: true
    },
    
    online: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: null,
    }
},
    {
        timestamps: true
    }
)

const userRegisterModel = mongoose.model("userRegisteredData", useRegisterSchema);
module.exports = userRegisterModel;