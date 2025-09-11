/* eslint-disable no-undef */
// eslint-disable-next-line react-refresh/only-export-components
import { useContext, useState } from "react";
import ChatContainer from "../component/chatContainer";
import RightContainer from "../component/rightSidebar";
import Sidebar from "../component/sideBar";
import { authContext } from "../context/authContext";

function HomePage() {
    const { user } = useContext(authContext);
    console.log("yeh alag hai", user);

    const [selectUser, setSelectUser] = useState(null);
    const [messages, setMessages] = useState({ messages: [] });

    return (
        <div className="h-screen w-full flex bg-gray-100">
            {/* Sidebar (Left Panel) */}
            <div className="w-1/4 border-r border-gray-300">
                <Sidebar
                    selectUser={selectUser}
                    setSelectUser={setSelectUser}
                    setMessages={setMessages}
                />
            </div>

            {/* Chat Container (Middle Panel) */}
            <div className="w-2/4 border-r border-gray-300">
                <ChatContainer
                    selectUser={selectUser}
                    messages={messages}
                    setMessages={setMessages}
                />
            </div>

            {/* Right Sidebar (Right Panel) */}
            <div className="w-1/4 hidden md:block">
                <RightContainer selectUser={selectUser} />
            </div>
        </div>
    );
}

export default HomePage;
