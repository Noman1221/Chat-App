import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";
import authRoutes from "./Routes/authRoutes.js";
import messageRoute from "./Routes/messageRoute.js";
import { ConnectToDb } from "./utils/db.js";
dotenv.config();





const app = express();
const server = createServer(app);

const allowedOrigins = [
    // "http://localhost:5173",
    "https://chat-app-1-y8hy.onrender.com"
];


const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // if using cookies or auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
};

// Apply the CORS configuration to all routes.
app.use(cors(corsOptions));


// Create a Socket.IO server for real-time connections and allow all origins. 
export const io = new Server(server, {
    cors: { origin: "*" },
})


// An object to store which user is connected to which socket.
export const userSocketMap = {};


io.on("connection", (socket) => {

    const userId = socket.handshake.auth?.userId;

    // console.log("here is", userId);


    if (userId) {
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = new Set();
        }
        userSocketMap[userId].add(socket.id);
        console.log("socket connected User:", userSocketMap);
        socket.userId = userId;
    }


    // Sends the list of online users to all connected clients.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Runs when a user disconnects. 

    socket.on("disconnect", () => {
        const uid = socket.userId;
        if (uid && userSocketMap[uid]) {
            userSocketMap[uid].delete(socket.id);
            if (userSocketMap[uid].size === 0) {
                delete userSocketMap[uid];
            }
        }
        // Update all clients with new online users.
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// Add API routes for authentication and messaging
app.use("/users/api", authRoutes);
app.use("/api/messages", messageRoute)


ConnectToDb();

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("server listen on port", port);
});
