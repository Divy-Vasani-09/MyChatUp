const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const userRegisterModel = require('./Models/userRegisterData');
const conversationModel = require('./Models/conversation');
const messageModel = require('./Models/message');
const mongoURI = 'mongodb://127.0.0.1:27017/users';


app.use(express.json());
app.use(cors());

mongoose.connect(mongoURI);

app.post('/Registration', async (req, res) => {
    try {
        const { UserName, EmailID, PhoneNo, Password } = req.body;
        userRegisterModel.findOne({ $or: [{ EmailID: EmailID }, { PhoneNo: EmailID }] })
            .then(exist => {
                if (exist) {
                    return res.status(409).json({
                        success: false,
                        message: 'Your Account is Already Exists!'
                    })
                }
                const SecurePassword = bcrypt.hashSync(Password, salt);
                // console.log("compare : ",bcrypt.compareSync(Password, SecurePassword));
                user = userRegisterModel.create({
                    UserName: UserName,
                    EmailID: EmailID,
                    PhoneNo: PhoneNo,
                    Password: SecurePassword,
                })
                    .then(user => {
                        console.log('Account successfully created!')
                        res.status(201).json({
                            success: true,
                            message: 'Your account successfully created!'
                        })
                    })
                    .catch(err => res.json(err))
            })
    } catch (err) {
        res.json(err);
    }
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
            if (!bcrypt.compareSync(Password, user.Password)) {
                return res.status(401).send({
                    error: 401,
                    message: "Password is incorrect!"
                });
            }
            const userData = {
                _id: user._id,
                UserName: user.UserName,
                PhoneNo: user.PhoneNo,
                EmailID: user.EmailID,
            };
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
                return res.status(404).json("No record existed");
            }
            if (bcrypt.compareSync(Password, user.Password)) {
                return res.status(409).json("Password is Already Exist!");
            }
            const SecurePassword = bcrypt.hashSync(Password, salt);
            userRegisterModel.updateOne(
                { $or: [{ EmailID: EmailIDOrPhoneNo }, { PhoneNo: EmailIDOrPhoneNo }] },
                { $set: { Password: SecurePassword } }
            )
                .then(() => res.json("Success"))
        })
})

app.post('/editProfile', (req, res) => {
    const { UserName, EmailID, PhoneNo, _id } = req.body;
    userRegisterModel.updateOne(
        { _id: _id },
        { $set: { UserName: UserName, PhoneNo: PhoneNo, EmailID: EmailID } }
    ).then(result => {
        if (result.modifiedCount === 0) {
            console.log("No document updated. Check if the _id exists.");
        }
        else {
            console.log("User updated successfully.");

            userRegisterModel.findOne({ _id: _id })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({
                            error: 404,
                            message: "No record existed"
                        });
                    }
                    const userData = {
                        _id: user._id,
                        UserName: user.UserName,
                        PhoneNo: user.PhoneNo,
                        EmailID: user.EmailID,
                    };
                    res.status(200).send({
                        success: true,
                        user: userData
                    });
                })
        }

    })

})

app.get('/SearchBarNewChat', (req, res) => {
    const { input, userData } = req.query;
    console.log("search")
    const regex = new RegExp(input, 'i');
    if (!input) {
        return res.status(400).send({
            success: false,
            message: "Input is required",
        });
    }
    userRegisterModel.find({ $or: [{ UserName: { $regex: regex } }, { PhoneNo: { $regex: regex } }] }, { Password: 0 })
        .then(user => {
            if (user.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No record existed"
                });
            }
            const itemToBeRemoved = userData._id.toString();
            user = user.filter(u => u._id.toString() !== itemToBeRemoved);

            res.status(200).json({
                user
            });
        })
})

app.post('/contact', async (req, res) => {
    const { userData } = req.body;
    const conversations = await conversationModel
        .find({ participants: { $in: [userData._id] } })
        .populate({
            path: "participants",
            select: "_id UserName EmailID PhoneNo",
        });

    if (conversations.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No conversations found",
        });
    }

    console.log("Fetched Conversations:", JSON.stringify(conversations, null, 1));

    res.status(200).json({
        success: true,
        conversations,
    });
})

app.post('/newChat', async (req, res) => {
    try {
        const { chosenResult, userData } = req.body;
        console.log("new");

        // Check already exist OR not
        const existingConversation = await conversationModel.findOne({
            participants: { $all: [userData._id, chosenResult._id] }
        });
        if (existingConversation) {
            console.log("Conversation already exists!");
            return res.status(409).send({
                success: false,
                message: "Conversation already exists!"
            })
        }

        // Create a new Conversation
        const createNewConversation = await conversationModel.create({
            participants: [
                userData._id, chosenResult._id
            ]
        })
        console.log("create",)
        const newConversation = await conversationModel
            .findById(createNewConversation._id)
            .populate({
                path: "participants",
                select: "_id UserName EmailID PhoneNo",
            })

        if (newConversation === null) {
            return res.status(404).json({
                success: false,
                message: "conversation not found",
            });
        }
        res.status(200).send({
            success: true,
            newConversation,
        });
    }
    catch (error) {
        console.log("Error in /newChat", error);
        return res.status(500).json({
            success: false,
            message: "Server Error!",
            error
        });
    }
})

app.post('/sendMessage', async (req, res) => {
    try {
        const { inputOfMessage, roomInfo } = req.body;
        console.log(inputOfMessage)
        const receiverId = roomInfo.receiverInfo._id;
        const senderId = roomInfo.senderInfo._id;

        const message = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            message: inputOfMessage
        });
        const room = await conversationModel.updateOne(
            { participants: { $all: [senderId, receiverId] } },
            { $push: { messages: { $each: [message._id], $position: 0 } } }
        )

        res.status(200).json({
            success: true,
            inputOfMessage: inputOfMessage
        })
    } catch (err) {
        console.log("Error in /sendMessage", err);
    }
})

app.listen(3002, () => {
    console.log("Server is Running")
})