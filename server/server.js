const express = require("express");
// const session = require("express-session");
// const mongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cors = require("cors");
const userRegisterModel = require("./Models/userRegisterData");
const app = express();
const mongoURI = "mongodb://127.0.0.1:27017/users";


app.use(express.json());
app.use(cors());

mongoose.connect(mongoURI);

app.post('/Registration', (req, res) => {
    userRegisterModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.post('/Login', (req, res) => {
    const { EmailIDOrPhoneNo, Password } = req.body;
    userRegisterModel.findOne({ $or: [{ EmailID: EmailIDOrPhoneNo }, { PhoneNo: EmailIDOrPhoneNo }] })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    error: 404,
                    message: "No record existed"
                });
            }
            if (user.Password !== Password) {
                return res.status(401).send({
                    error: 401,
                    message: "Password is incorrect!"
                });
            }
            const userData = user;
            console.log(user)
            res.status(200).send({
                success: true,
                user: userData
            });
        })
})

app.post('/ForgotPassword', (req, res) => {
    const { EmailIDOrPhoneNo, Password, ConfirmPassword } = req.body;
    userRegisterModel.findOne({ $or: [{ EmailID: EmailIDOrPhoneNo }, { PhoneNo: EmailIDOrPhoneNo }] })
        .then(user => {
            if (!user) {
                return res.status(404).send("No record existed");
            }
            if (user.Password === Password) {
                return res.status(500).send("Password is Already Exist!");
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