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
export const userSocketMap = {};

io.on("connection", (socket) => {

    const userId = socket.handshake.auth?.userId;


    if (userId) {
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = new Set();
        }
        userSocketMap[userId].add(socket.id);

        console.log("socket connected User:", userSocketMap);
        socket.userId = userId;
    }

    // Send online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        const uid = socket.userId;
        if (uid && userSocketMap[uid]) {
            userSocketMap[uid].delete(socket.id);
            if (userSocketMap[uid].size === 0) {
                delete userSocketMap[uid];
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


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
