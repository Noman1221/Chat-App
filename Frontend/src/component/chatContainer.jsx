import { useContext, useEffect, useRef, useState } from "react";
import { FaPaperclip, FaSmile } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
import img1 from "../assets/img1.jpg";
import { authContext } from "../context/authContext";

function ChatContainer({ selectUser, messages, setMessages }) {
    const { user, getMessages, messageSend, markMessageAsSeen } = useContext(authContext);

    const [newMessages, setNewMessages] = useState("");
    const [file, setFile] = useState(null);
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const id = selectUser?._id;

    // Mark as seen
    useEffect(() => {
        if (!id) return;
        const markSeen = async () => {
            try {
                await markMessageAsSeen(id);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.senderId === id
                            ? { ...msg, seen: true, seenAt: Date.now() }
                            : msg
                    )
                );
            } catch (err) {
                console.error("Seen update failed:", err);
            }
        };
        markSeen();
    }, [id, markMessageAsSeen, setMessages]);

    // Connect to socket.io
    useEffect(() => {
        if (!user) return;

        if (!socketRef.current) {
            socketRef.current = io("http://localhost:5000", {
                auth: { userId: user?._id },
            });
        }

        const socket = socketRef.current;

        const handleNewMessage = (msg) => {
            if (
                (msg.senderId === user?._id && msg.recieverId === id) ||
                (msg.senderId === id && msg.recieverId === user?._id)
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [user, id, setMessages]);

    // Auto-scroll to latest message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Send message
    const handleForm = async (e) => {
        e.preventDefault();
        if (!newMessages.trim() && !file) return;

        const formData = new FormData();
        formData.append("text", newMessages);
        if (file) formData.append("image", file);

        try {
            await messageSend(formData, id);
            setNewMessages("");
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Load messages
    useEffect(() => {
        const getAllMsg = async () => {
            if (!id) return;
            const res = await getMessages(id);
            setMessages(res.messages || []);
        };
        getAllMsg();
    }, [getMessages, id, selectUser, setMessages]);

    // Format time
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Sticky Navbar */}
            {selectUser ? (
                <div className="sticky top-0 z-10 bg-white shadow flex items-center gap-3 p-4">
                    <img
                        src={selectUser?.profilePicture || img1}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <h2 className="font-semibold text-gray-800">{selectUser?.fullname}</h2>
                        <span className="text-xs text-gray-500">Online</span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-4 text-gray-500">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-medium mb-2">QuickChat</h3>
                        <p>Select a contact to start chatting</p>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {selectUser && messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map((msg) => {
                            const isSender = msg.senderId === user?._id;
                            return (
                                <div
                                    key={msg._id}
                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-xs lg:max-w-md ${isSender ? 'flex-row-reverse' : ''}`}>
                                        {/* Profile Image */}
                                        <img
                                            src={isSender ? user.profilePicture || "https://via.placeholder.com/32" : selectUser?.profilePicture || "https://via.placeholder.com/32"}
                                            alt="profile"
                                            className="w-8 h-8 rounded-full object-cover mx-2 self-end"
                                        />

                                        {/* Message Bubble */}
                                        <div
                                            className={`relative p-3 rounded-2xl shadow-sm ${isSender
                                                ? 'bg-green-100 rounded-br-none'
                                                : 'bg-white rounded-bl-none'
                                                }`}
                                        >
                                            {msg.text && <p className="mb-1 text-gray-800">{msg.text}</p>}
                                            {msg.image && (
                                                <img
                                                    src={msg.image}
                                                    alt="attachment"
                                                    className="w-40 h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                                                    onClick={() => window.open(msg.image, "_blank")}
                                                />
                                            )}
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(msg.updatedAt)}
                                                </span>
                                                {msg.seen && isSender && (
                                                    <span className="text-blue-500 text-xs ml-2">Seen</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                ) : selectUser ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <p>No messages yet</p>
                            <p className="text-sm">Send a message to start the conversation</p>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Input Area */}
            {selectUser && (
                <form
                    onSubmit={handleForm}
                    className="sticky bottom-0 bg-white p-3 flex items-center gap-2 border-t"
                >
                    {/* Emoji button */}
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    >
                        <FaSmile size={20} />
                    </button>

                    {/* File attachment button */}
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FaPaperclip size={20} />
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    {/* Message input */}
                    <input
                        type="text"
                        value={newMessages}
                        onChange={(e) => setNewMessages(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-300"
                    />

                    {/* Send button */}
                    <button
                        type="submit"
                        disabled={!newMessages.trim() && !file}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <IoMdSend size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}

export default ChatContainer;