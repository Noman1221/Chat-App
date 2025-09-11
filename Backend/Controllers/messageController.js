
import user from "../Models/AuthModel.js";
import Message from "../Models/message.js";
import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        let userId = req.user.userId;
        let filteredUser = await user.find({ _id: { $ne: userId } });
        let unseenMessages = {};
        let promises = filteredUser.map(async (user) => {
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

export const getMessages = async (req, res) => {
    try {
        let { id } = req.params
        let userId = req.user.userId;
        let messages = await Message.find({
            $or: [
                { senderId: userId, recieverId: id },
                { senderId: id, recieverId: userId },

            ],
        }).sort({ createdAt: 1 }).populate("senderId", "fullname profilePicture").populate("recieverId", "fullname profilePicture");
        await Message.updateMany({ senderId: id, recieverId: userId }, { seen: true });
        res.status(200).json({ message: "get all selected user messages", messages });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// mark message as to seen

export const markMessageAsSeen = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body; // from frontend

        await Message.updateMany(
            { senderId, receiverId, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json({ message: "Messages marked as seen" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};


// send message to individual 

// messageController.js (messageSend)
export const messageSend = async (req, res) => {
    try {
        const { id } = req.params; // receiver id
        const userId = req.user.userId; // sender id from auth middleware
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

        const recieverSocketId = userSocketMap[id];
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", payload);
        }

        // Optionally also emit to the sender socket so other sender tabs/devices receive it
        const senderSocketId = userSocketMap[userId];
        if (senderSocketId && senderSocketId !== recieverSocketId) {
            io.to(senderSocketId).emit("newMessage", payload);
        }

        res.status(200).json({ message: "message sent successfully", newMessage: payload });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
