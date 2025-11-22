
// Importing the user model and message model to interact with MongoDB.

import user from "../Models/AuthModel.js";
import Message from "../Models/message.js";
// Importing io and userSocketMap from the server to handle real - time messages with Socket.IO.
import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
// “This function fetches all users except the logged -in one and also shows which users have sent unseen messages.”
export const getUsersForSidebar = async (req, res) => {
    try {
        let userId = req.user._id;
        // Find all users whose ID is not equal to the logged -in user.
        let filteredUser = await user.find({ _id: { $ne: userId } });
        // It checks if that user has any unseen(unread) messages for the logged -in user.
        let unseenMessages = {};
        let promises = filteredUser.map(async (user) => {
            // If unseen messages exist,
            // → Store them inside unseenMessages[user._id].
            const messages = await Message.find({ senderId: user._id, recieverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages;
            }
        })
        await Promise.all(promises)
        res.status(200).json({ users: filteredUser, unseenMessages })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get all the messages
// This function fetches all messages between the logged -in user and the selected contact
// This API fetches all chat history between two users and automatically marks any unseen messages as seen
export const getMessages = async (req, res) => {
    try {
        let { id } = req.params;
        let userId = req.user._id;

        console.log("Fetching messages for user:", userId, "with contact:", id);
        // After fetching, it marks unseen messages as seen.
        let messages = await Message.find({
            $or: [
                { senderId: userId, recieverId: id },
                { senderId: id, recieverId: userId },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("senderId", "fullname profilePicture")
            .populate("recieverId", "fullname profilePicture");

        // Mark messages as seen - use string IDs consistently
        await Message.updateMany(
            {
                senderId: id,
                recieverId: userId,
                seen: false // Only mark unseen messages as seen
            },
            {
                seen: true,
                seenAt: new Date()
            }
        );

        res.status(200).json({
            message: "Get all selected user messages",
            messages
        });
    } catch (error) {
        console.log("Error in getMessages:", error.message);
        res.status(500).json({ message: error.message });
    }
}

// This marks all messages from a specific sender as seen and stores the time when they were read.
export const markMessageAsSeen = async (req, res) => {
    try {
        const receiverId = req.user._id; // logged-in user from isAuthenticate
        const senderId = req.params.id;  // selected user id from URL

        let seenMessage = await Message.updateMany(
            { senderId, receiverId, seen: false },
            { $set: { seen: true, seenAt: new Date() } }
        );

        res.status(200).json({ message: "Messages marked as seen", seenMessage });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};



// This function sends a new message from one user to another
// and also delivers it in real - time using Socket.IO
// This function saves the message in MongoDB and instantly emits it to both users through Socket.IO for real - time chat updates
export const messageSend = async (req, res) => {
    try {
        const { id } = req.params; // receiver id
        const userId = req.user._id;  // sender id from auth middleware
        const { text } = req.body;

        let imgUrl = undefined;
        if (req.file) imgUrl = req.file.path;

        const newMessage = new Message({
            senderId: userId,
            recieverId: id,
            text,
            image: imgUrl,
        });

        const saved = await newMessage.save();

        // Convert to plain object and normalize id fields to strings
        // Prepare a payload(a clean object) containing message details.
        const payload = {
            _id: saved._id.toString(),
            senderId: saved.senderId.toString(),
            recieverId: saved.recieverId.toString ? saved.recieverId.toString() : String(id),
            text: saved.text,
            image: saved.image,
            seen: saved.seen || false,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        };
        // Find all socket IDs of the receiver:
        const recieverSocketIds = userSocketMap[id];
        if (recieverSocketIds) {
            [...recieverSocketIds].forEach((sockId) => {   // Convert Set → Array
                // Send real-time message event:
                io.to(sockId).emit("newMessage", payload);
            });
        }

        const senderSocketIds = userSocketMap[userId];
        if (senderSocketIds) {
            [...senderSocketIds].forEach((sockId) => {
                io.to(sockId).emit("newMessage", payload);
            });
        }



        res.status(200).json({ message: "message sent successfully", newMessage: payload });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
