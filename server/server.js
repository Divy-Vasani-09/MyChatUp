const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const userRegisterModel = require("./Models/userRegisterData");
const userLoginModel = require("./Models/userLoginData");

const app = express();
app.use(express.json());
app.use(session({
    secret: "UserLoggedData",
    resave: false,
    saveUninitialized: false,
}));
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/users");

app.post('/Registration', (req, res) => {
    userRegisterModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.post('/Login', (req, res) => {
    const { EmailIDOrPhoneNo, Password } = req.body;
    userRegisterModel.findOne({ $or: [{ EmailID: EmailIDOrPhoneNo }, { PhoneNo: EmailIDOrPhoneNo }] })
        .then(user => {
            if (user) {
                // console.log(user)
                if (user.Password === Password) {
                    res.json("Success");
                    const userData = { UserName: user.UserName, EmailID: user.EmailID, PhoneNo: user.PhoneNo, Password: user.Password };
                    req.session.userLoggedData = userData;
                    userLoginModel.create(userData)
                }
                else {
                    // res.json({message:"Password is incorrect!", status:400});
                    res.status(400).send("Password is incorrect!")
                }
            }
            else {
                res.status(401).send("No record existed");
            }
        })
})

app.post('/ForgotPassword', (req, res) => {
    const { EmailIDOrPhoneNo, Password, ConfirmPassword } = req.body;
    userRegisterModel.findOne({ $or: [{ EmailID: EmailIDOrPhoneNo }, { PhoneNo: EmailIDOrPhoneNo }] })
        .then(user => {
            if (!user) {
                res.status(404).send("No record existed");
                return
            }
            if (user.Password === Password) {
                res.status(500).send("Password is Already Exist!")
                return
            }
            userRegisterModel.updateOne(
                { $or: [{ EmailID: EmailIDOrPhoneNo }, { PhoneNo: EmailIDOrPhoneNo }] },
                { $set: { Password: Password } }
            )
            .then(() => res.json("Success"))
        })
})

app.listen(3002, () => {
    console.log("Server is Running")
})