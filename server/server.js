const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRegisterModel = require("./Models/userRegisterData")

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/users");

app.post('/Registration', (req, res) => {
    userRegisterModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(3002, () => {
    console.log("Server is Running")
})