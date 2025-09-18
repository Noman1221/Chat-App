import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { authContext } from "../context/authContext";

function ChatContainer({ selectUser, messages, setMessages }) {
    console.log(messages);


    let id = selectUser?._id;
    const { user, getMessages, messageSend, markMessageAsSeen } = useContext(authContext);
    const [newMessages, setNewMessages] = useState("");
    const [file, setFile] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!id) return;

        const markSeen = async () => {
            try {
                await markMessageAsSeen(id); // API call
                // update frontend messages seen = true
                setMessages(prev =>
                    prev.map(msg =>
                        msg.senderId === id ? { ...msg, seen: true, seenAt: Date.now() } : msg
                    )
                );
            } catch (err) {
                console.error("Seen update failed:", err);
            }
        };

        markSeen();
    }, [id]);


    // Connect to socket.io when user is available
    useEffect(() => {

        if (!user) return;

        if (!socketRef.current) {
            socketRef.current = io("http://localhost:5000", {
                auth: { userId: user.userId },   // send userId
            });
        }

        const socket = socketRef.current;

        const handleNewMessage = (msg) => {
            if (
                (msg.senderId === user.userId && msg.recieverId === id) ||
                (msg.senderId === id && msg.recieverId === user.userId)
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [user, id, setMessages]);

    const handleForm = async (e) => {
        e.preventDefault();
        if (!newMessages && !file) return;

        const formData = new FormData();
        formData.append("text", newMessages);
        if (file) {
            formData.append("image", file);
        }

        try {
            const data = await messageSend(formData, id);
            console.log(data.newMessage._id);

            setNewMessages("");
            setFile(null);
            // No need to emit socket event, backend will broadcast
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getAllMsg = async () => {
            if (!id) return;
            let res = await getMessages(id);
            setMessages(res.messages || []);
        };
        getAllMsg();
    }, [getMessages, id, selectUser, setMessages]);



    return (
        <div>
            {selectUser ? (
                <div>
                    <img src={selectUser?.profilePicture} style={{ width: "30px", height: "30" }} />
                    <h2>{selectUser?.fullname}</h2>
                </div>
            ) : (
                <h2>please select user</h2>
            )}

            {selectUser ? messages.map((msg) => (
                <div key={msg._id}>
                    <p>
                        {msg.text} <span>{(new Date(msg.updatedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' }))}</span>

                    </p>
                    <img src={msg.image} />
                </div>
            )) : "No messages found"}
            {selectUser ? (
                <form onSubmit={handleForm}>
                    <input type="text" value={newMessages} onChange={e => setNewMessages(e.target.value)} placeholder="add message" />
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button type="submit">Send</button>
                </form>
            ) : ""};
            {messages.map((msg) => {
                const isRecentSeen =
                    msg.seen && msg.seenAt && Date.now() - new Date(msg.seenAt).getTime() < 60000;

                return (
                    <div key={msg._id} className="message">
                        <p>
                            {msg.text}
                            <span>
                                {new Date(msg.updatedAt).toLocaleString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </p>

                        {msg.image && (
                            <img
                                src={msg.image}
                                alt="attachment"
                                style={{ width: "80px", cursor: "pointer" }}
                                onClick={() => window.open(msg.image, "_blank")}
                            />

                        )}

                        {/* Seen only for 1 min */}
                        {isRecentSeen && msg.senderId === user.userId && (
                            <span style={{ color: "blue", fontSize: "12px" }}>Seen</span>
                        )}
                    </div>
                );
            })}

        </div>
    );
}

export default ChatContainer;