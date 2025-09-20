/* eslint-disable no-undef */
// eslint-disable-next-line react-refresh/only-export-components
import { useState } from "react";
import ChatContainer from "../component/chatContainer";
import RightSideBar from "../component/rightSidebar";
import SideBar from "../component/sideBar";

function HomePage() {
    const [selectUser, setSelectUser] = useState(null);
    const [messages, setMessages] = useState([]);

    return (
        <div className="flex h-screen">
            <div className="w-1/4"> {/* 25% width */}
                <SideBar selectUser={selectUser} setSelectUser={setSelectUser} />
            </div>
            <div className="w-2/4"> {/* 50% width - changed from flex-1 to w-2/4 */}
                <ChatContainer
                    selectUser={selectUser}
                    messages={messages}
                    setMessages={setMessages}
                />
            </div>
            <div className="w-1/4 bg-gray-100"> {/* 25% width */}
                <RightSideBar selectUser={selectUser} />
                rightSideBar
            </div>
        </div>
    );
}

export default HomePage;
