import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";
import authRoutes from "./Routes/authRoutes.js";
import messageRoute from "./Routes/messageRoute.js";
import { ConnectToDb } from "./utils/db.js";
dotenv.config();


// await Message.deleteMany({});
// console.log("all message deleted");


const app = express();
const server = createServer(app);
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));


export const io = new Server(server, {
    cors: { origin: "*" },
})

// store online users 
export const userSocketMap = {}

io.on("connection", (socket) => {
    const userId = socket.handshake.query?.userId || socket.handshake.auth?.userId || null;
    console.log("socket connected, userId:", userId);


    if (userId) {
        userSocketMap[userId] = socket.id;
        // Optionally store reverse map socketId -> userId for cleanup
        socket.userId = userId;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        const uid = socket.userId || userId;
        console.log("socket disconnected, userId:", uid);
        if (uid && userSocketMap[uid]) delete userSocketMap[uid];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

app.use(express.json({ limit: "10mb" })); // Increase from 4mb to 10mb
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Mount your routes
app.use("/users/api", authRoutes);
app.use("/api/messages", messageRoute)


ConnectToDb();

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("server listen on port", port);
});
