const express = require('express');
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
require("dotenv").config();
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const userRegisterModel = require('./Models/userRegisterData');
const conversationModel = require('./Models/conversation');
const messageModel = require('./Models/message');
const reportModel = require('./Models/Report');

const mongoURI = 'mongodb://127.0.0.1:27017/users';
const Server = require('socket.io').Server;

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Agora credentials
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

const app = express();
app.use(express.json({ limit: "50mb" }));  // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.get("/agora-token", (req, res) => {
    const channelName = req.query.channelName;
    if (!channelName) {
        return res.status(400).json({ error: "Channel name is required" });
    }

    const uid = Math.floor(Math.random() * 10000) + 1; // Use a random UID
    const role = RtcRole.PUBLISHER;
    const expireTime = 3600; // Token expires in 1 hour
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        role,
        privilegeExpireTime
    );
    // console.log("Generated Agora Token:", { token, appId: APP_ID, channelName, uid });

    res.json({ token, appId: APP_ID, channelName, uid });
});

const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "*",
        origin: "http://localhost:5173",
    },
    maxHttpBufferSize: 1e8,
    pingTimeout: 90000,
    pingInterval: 30000,
})

const socketIdToUserId = new Map();
let users = 0;
let roomId = null;

io.on('connection', (socket) => {
    console.log("a User Connected", socket.id);
    let userId = socket.handshake.query.userId;

    users++;
    socket.emit('broadcast', { msg: 'Hii, Welcome!' })
    socket.broadcast.emit('broadcast', { msg: users + ' users connected!' })

    socket.on("join_chatApp", (userId) => {
        socket.join(userId)
        console.log(`User ${socket.id} join chat ${userId}`)
    })

    socket.on("leave_chatApp", (userId) => {
        socket.leave(userId)
        console.log(`User ${socket.id} leave chat ${userId}`)
    })

    socket.on('join room', async (roomInfo) => {
        socket.leave(roomId);
        roomId = roomInfo.conversation_id;
        const receiverId = roomInfo.receiverInfo._id;
        const senderId = roomInfo.senderInfo._id;

        console.log("connected Room Id :-", roomId)

        socket.join(roomId);

        try {
            const page = 1;
            const limit = 50;

            const messages = await conversationModel.find({ _id: roomId })
                .populate({
                    path: "messages",
                    match: { unActiveIds: { $nin: [userId] } },
                    options: { sort: { _id: -1 }, skip: (page - 1) * limit, limit: limit }, // Pagination applied
                    select: "_id sender receiver message unActiveIds image video createdAt updatedAt",
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

    socket.on('load more messages', async ({ roomId, page }) => {
        try {
            const limit = 50;

            const messages = await conversationModel.findOne({ _id: roomId })
                .populate({
                    path: "messages",
                    options: { sort: { _id: -1 }, skip: (page - 1) * limit, limit: limit },
                    select: "_id sender receiver message image video updatedAt",
                    populate: {
                        path: "sender receiver",
                        select: "_id UserName EmailID PhoneNo",
                    }
                });

            if (!messages) return;

            socket.emit('more messages', { messages });

        } catch (err) {
            console.log("Error in 'load more messages' event:", err);
        }
    });

    socket.on("user_online", async ({ userId }) => {
        try {
            console.log(`Received user_online event from ${socket.id} for user ${userId}`);

            const user = await userRegisterModel.findById(userId);
            if (user) {
                console.log("Setting user to online in database");
                user.online = true;
                await user.save();
                socketIdToUserId.set(socket.id, userId);

                console.log(`Emitting user_online event for user ${user._id}`);
                io.emit("user_online", { userId: user._id, online: true });
            }
        } catch (error) {
            console.log("Error updating user status:", error);
        }
    });


    socket.on('sendNewMessage', async (data) => {
        try {
            const { newMessage, newImageMessage, newVideoMessage, roomInfo } = data;
            const roomId = roomInfo.conversation_id;
            console.log("sendNewMessage called");

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
            conversation.latestMessage = message._id;
            await conversation.save();

            const populatedMessage = await messageModel.findById(message._id)
                .populate({
                    path: "sender receiver message image video updatedAt",
                    select: "_id UserName EmailID PhoneNo "
                });

            io.to(roomId).emit("receiveNewMessage", { receiveNewMessage: populatedMessage })
            io.to(receiverId).emit("new_Message", { receiveNewMessage: populatedMessage })
            const validMessageIds = await messageModel.distinct("_id");

            const remove = await conversationModel.updateMany(
                { _id: roomId },
                {
                    $pull: {
                        messages: { $nin: validMessageIds }
                    }
                }
            );
            // const removeImagesVideos = await messageModel.deleteMany({
            //     $or: [
            //         { image: { $exists: true, $ne: null, $ne: "" } },
            //         { video: { $exists: true, $ne: null, $ne: "" } }
            //     ]
            // });

            console.log("socket.send msg", data.newMessage)
        } catch (err) {
            console.log("Error in /sendMessage", err);
        }
    })

    socket.on('block', async (data) => {
        try {
            const { userId, roomInfo, blockedId } = data;

            io.to(roomId).emit("block", { userId, roomInfo, blockedId })
        } catch (error) {
            console.log('Error in block socket : ', error);
        }
    })

    socket.on('unblock', async (data) => {
        try {
            const { userId, roomInfo, blockedId } = data;

            io.to(roomId).emit("unblock", { userId, roomInfo, blockedId })
        } catch (error) {
            console.log('Error in block socket : ', error);
        }
    })

    socket.on('clearChatEffect', async (data) => {
        try {
            const { roomInfo, unActiveIds, clearFor } = data;
            const roomId = roomInfo.conversation_id;
            const page = 1;
            const limit = 50;

            const messages = await conversationModel.find({ _id: roomId })
                .populate({
                    path: "messages",
                    match: { unActiveIds: { $nin: [userId] } },
                    options: { sort: { _id: -1 }, skip: (page - 1) * limit, limit: limit }, // Pagination applied
                    select: "_id sender receiver message unActiveIds image video createdAt updatedAt",
                    populate: {
                        path: "sender receiver",
                        select: "_id UserName EmailID PhoneNo",
                    }
                });
            if (!messages) return;
            if (clearFor.me){
                return socket.emit('clearChat', { messages });
            }
            if(clearFor.everyone){
                io.to(roomId).emit('clearChat', { messages });
                return
            }

        } catch (error) {
            console.log('Error in clearChatEffect socket : ', error);
        }
    })

    socket.on("disconnect", async (reason) => {
        console.log("User Is Disconnected!", reason);

        users--;
        socket.broadcast.emit('broadcast', { msg: users + ' users connected!' })

        if (reason === "transport error" || reason === "ping timeout") {
            console.log("Reconnecting...");
            setTimeout(() => {
                socket.connect();
            }, 2000);
        }

        const userId = socketIdToUserId.get(socket.id)
        if (userId) {
            try {
                const user = await userRegisterModel.findById(userId)
                if (user) {
                    user.online = false,
                        user.lastSeen = new Date();
                    await user.save();
                    io.emit('user_online', { userId: user._id, online: false, lastSeen: user.lastSeen })
                    console.log('user disconnected successfully...!');
                }
            } catch (error) {

            }
        }

        socket.disconnect();
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
                    online: false,
                    lastSeen: new Date(),
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
                DP: user.DP,
                About: user.About,
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
    const { UserName, EmailID, PhoneNo, About, _id } = req.body;
    userRegisterModel.updateOne(
        { _id: _id },
        { $set: { UserName: UserName, PhoneNo: PhoneNo, EmailID: EmailID, About: About } }
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
                        DP: user.DP,
                        About: user.About,
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
            path: "participants latestMessage",
            select: "_id DP UserName EmailID PhoneNo About online lastSeen message sender receiver image video updatedAt",

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
            participants: [userData._id, chosenResult._id],
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

app.post('/uploadDp', async (req, res) => {
    try {
        const { selectedImage, userData } = req.body;
        const userId = userData?._id;

        if (!userId || !selectedImage || selectedImage.length < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid input!"
            });
        }

        const result = await cloudinary.uploader.upload(selectedImage, {
            folder: 'CloudinaryDP',
            allowed_formats: ['jpeg', 'png', 'jpg'],
        });

        console.log("Upload Success:", result.secure_url);

        const updatedUser = await userRegisterModel.findByIdAndUpdate(
            userId,
            { $set: { DP: result.secure_url } },
            { new: true },
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        console.log(updatedUser);

        return res.status(200).json({
            success: true,
            message: "Profile picture updated",
            userDp: updatedUser.DP
        });

    } catch (error) {
        console.error("Error in uploadDp", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.post('/block', async (req, res) => {
    try {
        const { userId, roomInfo, blockedId } = await req.body;
        const roomId = await roomInfo?.conversation_id;
        console.log('userId', userId);
        console.log('roomInfo:', roomInfo);
        console.log('roomId:', roomId);
        console.log('blockedId', blockedId);
        if (!roomId || !blockedId) {
            return res.status(400).json({
                success: false,
                message: "Invalid room ID or blocked person!"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(blockedId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ObjectId format!"
            });
        }

        const block = await conversationModel.findByIdAndUpdate(
            roomId,
            { $addToSet: { blockedIds: blockedId } },
            { new: true }
        );

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Room not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "User blocked successfully!",
            updatedConversation: block
        });

    } catch (error) {
        console.error('Error in /block:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});
app.post('/unblock', async (req, res) => {
    try {
        const { userId, roomInfo, blockedId } = await req.body;
        const roomId = await roomInfo?.conversation_id;

        if (!roomId || !blockedId) {
            return res.status(400).json({
                success: false,
                message: "Invalid room ID or blocked person!"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(blockedId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ObjectId format!"
            });
        }

        const unblock = await conversationModel.findByIdAndUpdate(
            roomId,
            { $pull: { blockedIds: blockedId } },
            { new: true }
        );

        if (!unblock) {
            return res.status(404).json({
                success: false,
                message: "Room not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "User blocked successfully!",
            updatedConversation: unblock
        });

    } catch (error) {
        console.error('Error in /unblock:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

app.post('/report', async (req, res) => {
    try {
        const { userId, roomInfo, reportedId, reportMessage } = req.body;
        const roomId = await roomInfo?.conversation_id;

        if (!userId || !roomId || !reportedId || !reportMessage) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input!"
            });
        }

        const conversation = await conversationModel.findById(roomId)
            .populate({
                path: "messages",
                select: "_id",
                options: { sort: { _id: -1 }, limit: 5 }
            });

        if (!conversation) {
            return res.status(400).json({
                success: false,
                message: "you don't have last five messages!"
            });
        }

        const lastFiveMessageIds = conversation.messages.map(msg => msg._id);

        const report = reportModel.create({
            reporterId: userId,
            reportedId: reportedId,
            lastFiveMessageIds: lastFiveMessageIds,
            reportMessage: reportMessage
        })

        if (!report) {
            return res.status(400).json({
                success: false,
                message: "report not submitted!"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Your report submitted!",
        });

    } catch (error) {
        console.log("Error in /report : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
})

app.post('/clearChat', async (req, res) => {
    try {
        const { userId, roomInfo, unActiveIds, chats } = await req.body;
        const roomId = await roomInfo?.conversation_id;

        console.log("clearChat called");

        if (!userId || !roomId | !unActiveIds || !unActiveIds.length || !chats || !chats.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input!"
            });
        }

        const messagesIds = await chats.map(chat => chat._id);
        console.log(messagesIds);

        const updatedMessages = await messageModel.updateMany(
            { _id: { $in: messagesIds } },
            { $addToSet: { unActiveIds: { $each: unActiveIds } } },
            { new: true }
        )
        console.log(updatedMessages);

        res.status(200).json({
            success: true,
            message: 'Chat cleared successfully!',
            updatedMessages
        })

    } catch (error) {
        console.log('Error in /clearChat : ', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
})

server.listen(port, () => {
    console.log("Server is Running http://localhost:3002")
})