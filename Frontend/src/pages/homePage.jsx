/* eslint-disable no-undef */
// eslint-disable-next-line react-refresh/only-export-components
import { useState } from "react";
import ChatContainer from "../component/chatContainer";
import RightSideBar from "../component/rightSideBar";
import SideBar from "../component/sideBar";

function HomePage() {
    const [selectUser, setSelectUser] = useState(null);
    const [messages, setMessages] = useState([]);




    return (
        <div className="flex h-screen">
            <div className="w-1/4">
                <SideBar selectUser={selectUser} setSelectUser={setSelectUser} />
            </div>
            <div className="flex-1">
                <ChatContainer
                    selectUser={selectUser}
                    messages={messages}
                    setMessages={setMessages}
                />
            </div>
            <div className="w-1/4 bg-gray-100">
                <RightSideBar selectUser={selectUser} />  {/* Corrected the component usage */}
                rightSideBar
            </div>
        </div>
    );
}

export default HomePage;
