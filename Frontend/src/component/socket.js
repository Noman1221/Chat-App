// src/socket.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
    if (!userId) return null;
    // If already connected, return it
    if (socket && socket.connected) return socket;

    socket = io("http://localhost:5000", {
        transports: ["websocket"],
        // send the userId in query or auth
        query: { userId },
        // OR: auth: { userId }
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
