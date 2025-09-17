import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { authContext } from "../context/authContext";

function ChatContainer({ selectUser, messages, setMessages }) {
    let id = selectUser?._id;
    const { user, getMessages, messageSend, markMessageAsSeen } = useContext(authContext);
    const [newMessages, setNewMessages] = useState("");
    const [file, setFile] = useState(null);
    const socketRef = useRef(null);

    // Connect to socket.io when user is available
    useEffect(() => {

        if (!user) return;
        console.log("user kya hai ", user.userId);

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
            ) : ""}
        </div>
    );
}

export default ChatContainer;