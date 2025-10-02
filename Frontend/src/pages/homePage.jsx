///* eslint-disable no-undef */
//// eslint-disable-next-line react-refresh/only-export-components
import { useEffect, useState } from "react";
import ChatContainer from "../component/chatContainer";
import RightSideBar from "../component/rightSidebar";
import SideBar from "../component/sideBar";

function HomePage() {
    const [selectUser, setSelectUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentView, setCurrentView] = useState("sidebar"); // "sidebar", "chat", "profile"

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && selectUser) {
                setCurrentView("chat");
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [selectUser]);

    const handleSelectUser = (user) => {
        setSelectUser(user);
        if (isMobile) {
            setCurrentView("chat");
        }
    };

    const handleBackToSidebar = () => {
        if (isMobile) {
            setCurrentView("sidebar");
            setSelectUser(null);
        }
    };

    const handleShowProfile = () => {
        if (isMobile) {
            setCurrentView("profile");
        } else {
            setShowRightSidebar(!showRightSidebar);
        }
    };

    const handleBackToChat = () => {
        if (isMobile) {
            setCurrentView("chat");
        }
    };

    // Desktop layout
    if (!isMobile) {
        return (
            <div className="flex h-screen">
                <div className="w-1/4"> {/* 25% width */}
                    <SideBar selectUser={selectUser} setSelectUser={handleSelectUser} />
                </div>
                <div className={showRightSidebar ? "w-2/4" : "w-3/4"}> {/* 50% width */}
                    <ChatContainer
                        selectUser={selectUser}
                        messages={messages}
                        setMessages={setMessages}
                        onShowProfile={handleShowProfile}
                        showProfileButton={!showRightSidebar}
                    />
                </div>
                {showRightSidebar && (
                    <div className="w-1/4 bg-gray-100"> {/* 25% width */}
                        <RightSideBar
                            selectUser={selectUser}
                            messages={messages}
                            onClose={handleShowProfile}
                        />
                    </div>
                )}
            </div>
        );
    }

    // Mobile layout
    return (
        <div className="h-screen">
            {/* Sidebar View */}
            {currentView === "sidebar" && (
                <div className="h-full">
                    <SideBar selectUser={selectUser} setSelectUser={handleSelectUser} />
                </div>
            )}

            {/* Chat View */}
            {currentView === "chat" && (
                <div className="h-full">
                    <ChatContainer
                        selectUser={selectUser}
                        messages={messages}
                        setMessages={setMessages}
                        onBack={handleBackToSidebar}
                        onShowProfile={handleShowProfile}
                        showProfileButton={true}
                        isMobile={true}
                    />
                </div>
            )}

            {/* Profile View */}
            {currentView === "profile" && (
                <div className="h-full">
                    <RightSideBar
                        selectUser={selectUser}
                        messages={messages}
                        onClose={handleBackToChat}
                        isMobile={true}
                    />
                </div>
            )}
        </div>
    );
}

export default HomePage;