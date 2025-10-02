///* eslint-disable no-undef */
//// eslint-disable-next-line react-refresh/only-export-components 
import { useState } from "react";
import ChatContainer from "../component/chatContainer";
import RightSideBar from "../component/rightSidebar";
import SideBar from "../component/sideBar";

function HomePage() {
    const [selectUser, setSelectUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Handle user selection (for mobile)
    const handleSelectUser = (user) => {
        setSelectUser(user);
        setShowChat(true);
        setShowProfile(false);
    };

    // Handle back to sidebar (mobile)
    const handleBackToSidebar = () => {
        setShowChat(false);
        setShowProfile(false);
    };

    // Toggle profile sidebar
    const handleToggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar - Always visible on desktop, conditional on mobile */}
            <div className={`
                ${!showChat && !showProfile ? 'flex' : 'hidden'} 
                md:flex md:w-1/4
                w-full absolute md:relative z-20
            `}>
                <SideBar
                    selectUser={selectUser}
                    setSelectUser={handleSelectUser}
                />
            </div>

            {/* Chat Container */}
            <div className={`
                ${showChat || !selectUser ? 'flex' : 'hidden'}
                md:flex
                ${selectUser ? "md:w-2/4" : "md:w-3/4"}
                w-full absolute md:relative z-10
            `}>
                <ChatContainer
                    selectUser={selectUser}
                    messages={messages}
                    setMessages={setMessages}
                    onBack={handleBackToSidebar}
                    onToggleProfile={handleToggleProfile}
                    showBackButton={showChat}
                />
            </div>

            {/* Right Sidebar - Only on desktop or when explicitly shown on mobile */}
            {selectUser && (
                <div className={`
                    ${showProfile ? 'flex' : 'hidden'}
                    md:flex md:w-1/4
                    w-full absolute md:relative z-30
                    bg-gray-100
                `}>
                    <RightSideBar
                        selectUser={selectUser}
                        messages={messages}
                        onBack={handleBackToSidebar}
                        showBackButton={showProfile}
                    />
                </div>
            )}
        </div>
    );
}

export default HomePage;