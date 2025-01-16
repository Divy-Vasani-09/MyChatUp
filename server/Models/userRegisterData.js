const mongoose = require("mongoose");

const useRegisterSchema = new mongoose.Schema({
    UserName: String,
    EmailID: String,
    PhoneNo: String,
    Password: String
})

const userRegisterModel = mongoose.model("userRegisteredData", useRegisterSchema);
module.exports = userRegisterModel;