const express = require('express');
require("dotenv").config();
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const userRegisterModel = require('./Models/userRegisterData');
const conversationModel = require('./Models/conversation');
const messageModel = require('./Models/message');

const mongoURI = 'mongodb://127.0.0.1:27017/users';
const Server = require('socket.io').Server;

const { cloud } = require('./storage/cloud');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const app = express();
app.use(express.json({ limit: "50mb" }));  // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "*",
        origin: "http://localhost:5173",
    },
    maxHttpBufferSize: 1e8, // 100MB buffer limit (adjust as needed)
    pingTimeout: 90000, // Extend timeout to avoid disconnection
    pingInterval: 30000, // Wait longer before timing out
})

let users = 0;
let roomId = null;
io.on('connection', (socket) => {
    console.log("a User Connected");

    users++;
    socket.emit('broadcast', { msg: 'Hii, Welcome!' })
    socket.broadcast.emit('broadcast', { msg: users + ' users connected!' })


    socket.on('join room', async (roomInfo) => {
        roomId = roomInfo.conversation_id;
        console.log("connected Room Id :-", roomId)
        socket.join(roomId);

        try {
            const messages = await conversationModel.find({ _id: roomId })
                .populate({
                    path: "messages",
                    select: "_id sender receiver message image video updatedAt",
                    populate: {
                        path: "sender receiver",
                        select: "_id UserName EmailID PhoneNo",
                    }
                });
            if (!messages) return;

            socket.emit('joined', { messages });

        } catch (err) {
            console.log("Error in joined Event : ", err)
        }
    })

    socket.on('sendNewMessage', async (data) => {
        try {
            const { newMessage, newImageMessage, newVideoMessage, roomInfo } = data;
            const roomId = roomInfo.conversation_id;

            const receiverId = roomInfo.receiverInfo._id;
            const senderId = roomInfo.senderInfo._id;

            console.log("new Image", !newVideoMessage);

            const conversation = await conversationModel.findById(roomId);
            if (!conversation) {
                console.log("Conversation not found");
                return;
            }

            let message;
            if (newVideoMessage.length > 0) {
                try {
                    for (const video of newVideoMessage) {
                        const result = await cloudinary.uploader.upload(video, {
                            folder: "CloudinaryVideos",
                            resource_type: "video"
                        });

                        console.log("upload :-", result.secure_url)

                        message = new messageModel({
                            sender: senderId,
                            receiver: receiverId,
                            video: result.secure_url
                        });
                    }

                    await message.save();

                } catch (error) {
                    console.log("error in video in cloud", error)
                }
            }

            if (newImageMessage.length > 0) {
                for (const image of newImageMessage) {
                    const result = await cloudinary.uploader.upload(image, {
                        folder: 'CloudinaryImages',
                        allowedFormats: ['jpeg', 'png', 'jpg'],
                    });

                    console.log("upload :-", result.secure_url)

                    message = await messageModel.create({
                        sender: senderId,
                        receiver: receiverId,
                        image: result.secure_url
                    });
                }
            }
            if (newMessage.length > 0) {
                message = await messageModel.create({
                    sender: senderId,
                    receiver: receiverId,
                    message: newMessage
                });
            }

            conversation.messages.push(message._id);
            await conversation.save();

            const populatedMessage = await messageModel.findById(message._id)
                .populate({
                    path: "sender receiver message image video updatedAt",
                    select: "_id UserName EmailID PhoneNo "
                });

            io.sockets.in(roomId).emit("receiveNewMessage", { receiveNewMessage: populatedMessage })
            console.log("socket.send msg", data.newMessage)

        } catch (err) {
            console.log("Error in /sendMessage", err);
        }
    })

    socket.on("disconnect", (reason) => {
        console.log("User Is Disconnected!", reason);
        users--;
        socket.broadcast.emit('broadcast', { msg: users + ' users connected!' })
        if (reason === "transport error" || reason === "ping timeout") {
            console.log("Reconnecting...");
            setTimeout(() => {
                socket.connect(); // Auto-reconnect
            }, 2000);
        }
    })
})

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
                const user = userRegisterModel.create({
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
        .find({
            $or: [
                { "participants.0": userData._id },
                { "participants.1": userData._id }
            ]
        })
        .populate({
            path: "participants messages",
            select: "_id UserName EmailID PhoneNo message",
        });

    if (conversations.length === 0) {
        return res.status(204).json({
            success: false,
            message: "No conversations found",
        });
    }

    res.status(200).json({
        success: true,
        conversations,
    });
})

// app.post('/newChat', async (req, res) => {
//     try {
//         const { chosenResult, userData } = req.body;
//         console.log("chosen: ", chosenResult);
//         console.log("user : ", userData);

//         // Check already exist OR not
//         const existingConversation = await conversationModel.findOne({
//             participants: { $all: [userData._id, chosenResult._id] }
//         });
//         if (existingConversation) {
//             console.log("Conversation already exists!");
//             return res.status(409).send({
//                 success: false,
//                 message: "Conversation already exists!"
//             })
//         }
//         console.log("hello")

//         // Create a new Conversation
//         const createNewConversation = await conversationModel.create({
//             participants: [
//                 userData._id, chosenResult._id
//             ]
//         })
//         console.log("create",)
//         const newConversation = await conversationModel
//             .findById(createNewConversation._id)
//             .populate({
//                 path: "participants",
//                 select: "_id UserName EmailID PhoneNo",
//             })

//         if (newConversation === null) {
//             return res.status(404).json({
//                 success: false,
//                 message: "conversation not found",
//             });
//         }
//         res.status(200).send({
//             success: true,
//             newConversation,
//         });
//     }
//     catch (error) {
//         console.log("Error in /newChat", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server Error!",
//             error
//         });
//     }
// })
app.post('/newChat', async (req, res) => {
    try {
        const { chosenResult, userData } = req.body;
        console.log("chosen: ", chosenResult);
        console.log("user : ", userData);

        // Validate necessary fields before inserting
        if (!chosenResult || !userData || !chosenResult._id || !userData._id) {
            return res.status(400).send({
                success: false,
                message: "Invalid participants data",
            });
        }

        // Check if the conversation already exists
        const existingConversation = await conversationModel.findOne({
            participants: { $all: [userData._id, chosenResult._id] }
        });

        if (existingConversation) {
            console.log("Conversation already exists!");
            return res.status(409).send({
                success: false,
                message: "Conversation already exists!"
            });
        }

        // Create a new Conversation
        const createNewConversation = await conversationModel.create({
            participants: [userData._id, chosenResult._id] // Only insert these fields
        });

        console.log("Conversation created");

        const newConversation = await conversationModel
            .findById(createNewConversation._id)
            .populate({
                path: "participants",
                select: "_id UserName EmailID PhoneNo",
            });

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

    } catch (error) {
        console.log("Error in /newChat", error);
        return res.status(500).json({
            success: false,
            message: "Server Error!",
            error
        });
    }
});



app.post('/allRegisteredData', async (req, res) => {
    try {
        const { userData } = await req.body;
        if (!userData) return;

        const allRegisteredData = await userRegisterModel.find();
        if (!allRegisteredData) return;

        let allData = [];
        for (let element of allRegisteredData) {
            allData.push({
                _id: element._id,
                UserName: element.UserName,
                PhoneNo: element.PhoneNo,
                EmailID: element.EmailID,
            })
        }

        res.status(200).json({
            success: true,
            allData
        })
    }
    catch (err) {
        console.log("error in /allRegisteredData", err);
    }
})

app.post('createGroup', async (req, res) => {
    try {
        const { newGroupData, groupData, userData } = req.body;

        console.log("create")
    } catch (err) {
        console.log("Error in /createGroup", err)
    }
})

app.post('/chats', async (req, res) => {
    try {
        const { roomInfo } = await req.body;
        const messages = await conversationModel.find({
            _id: roomInfo.conversation_id
        }).populate({
            path: "messages",
            select: "_id sender receiver message updatedAt",
            populate: {
                path: "sender receiver",
                select: "_id UserName EmailID PhoneNo",
            }
        })
        if (!messages) return;

        res.status(200).json({
            success: true,
            messages
        })

    } catch (err) {
        console.log("Error in /chats : ", err)
    }
})

// app.post('/sendMessage', async (req, res) => {
//     try {
//         const { newMessage, newImageMessage, newVideoMessage, roomInfo } = req.body;
//         const roomId = roomInfo.conversation_id;

//         const receiverId = roomInfo.receiverInfo._id;
//         const senderId = roomInfo.senderInfo._id;

//         console.log("new Image", !newVideoMessage);

//         const conversation = await conversationModel.findById(roomId);
//         if (!conversation) {
//             res.status(204).json({
//                 success: true,
//                 message: "Conversation not found"
//             })
//             console.log("Conversation not found");
//             return;
//         }

//         let message;
//         if (newVideoMessage.length > 0) {
//             try {
//                 for (const video of newVideoMessage) {
//                     const result = await cloudinary.uploader.upload(video, {
//                         folder: "CloudinaryVideo",
//                         resource_type: "video"
//                     });

//                     console.log("upload :-", result.secure_url)

//                     message = await messageModel.create({
//                         sender: senderId,
//                         receiver: receiverId,
//                         video: result.secure_url
//                     });
//                 }

//                 await messageModel.insertMany(message);

//             } catch (error) {
//                 console.log("error in video in cloud", error)
//             }
//         }

//         if (newImageMessage.length > 0) {
//             for (const image of newImageMessage) {
//                 const result = await cloudinary.uploader.upload(image, {
//                     folder: 'CloudinaryImages',
//                     allowedFormats: ['jpeg', 'png', 'jpg'],
//                 });

//                 console.log("upload :-", result.secure_url)

//                 message = await messageModel.create({
//                     sender: senderId,
//                     receiver: receiverId,
//                     image: result.secure_url
//                 });
//             }
//         }
//         if (newMessage.length > 0) {
//             message = await messageModel.create({
//                 sender: senderId,
//                 receiver: receiverId,
//                 message: newMessage
//             });
//         }

//         conversation.messages.push(message._id);
//         await conversation.save();

//         // const populatedMessage = await messageModel.findById(message._id)
//         //     .populate({
//         //         path: "sender receiver message image updatedAt",
//         //         select: "_id UserName EmailID PhoneNo "
//         //     });

//         // io.sockets.in(roomId).emit("receiveNewMessage", { receiveNewMessage: populatedMessage })

//         res.status(200).json({
//             success: true,
//             message
//         })

//         console.log("api.send msg", newMessage)

//     } catch (err) {
//         console.log("Error in /sendMessage", err);
//     }
// })
// app.post('/sendMessage', async (req, res) => {
//     try {
//         const { inputOfMessage, roomInfo } = req.body;
//         const receiverId = roomInfo.receiverInfo._id;
//         const senderId = roomInfo.senderInfo._id;

//         const message = await messageModel.create({
//             sender: senderId,
//             receiver: receiverId,
//             message: inputOfMessage
//         });
//         const room = await conversationModel.updateOne(
//             { participants: { $all: [senderId, receiverId] } },
//             { $push: { messages: { $each: [message._id], $position: 0 } } }
//         )

//         res.status(200).json({
//             success: true,
//             inputOfMessage: inputOfMessage
//         })
//     } catch (err) {
//         console.log("Error in /sendMessage", err);
//     }
// })

server.listen(port, () => {
    console.log("Server is Running http://localhost:3002")
})