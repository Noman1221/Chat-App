import { useContext, useEffect, useState } from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { MdCalendarToday, MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import { authContext } from "../context/authContext";

function UserProfile() {
    const { user, loading } = useContext(authContext);
    const navigate = useNavigate();
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            setProfileLoading(false);
        }
    }, [loading]);

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Profile Header with gradient */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 relative">
                    <button
                        onClick={() => navigate("/")}
                        className="absolute left-4 top-6 p-2 rounded-full hover:bg-green-700 transition"
                    >
                        <FaArrowLeft size={18} className="text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-center text-white">My Profile</h1>
                    <p className="text-center text-green-100 text-sm mt-1">View your account information</p>
                </div>

                {/* Content Container */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Profile Image Section */}
                        <div className="flex flex-col items-center md:w-1/3">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                                    <img
                                        src={user?.profilePicture || img1}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full border-4 border-green-500"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-2 border-2 border-white shadow-md">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-white"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mt-4 text-gray-800 text-center">{user?.fullname || "User Name"}</h2>
                            <p className="text-gray-500 text-sm text-center">{user?.email || "user@example.com"}</p>
                        </div>

                        {/* Right: User Information Cards */}
                        <div className="flex-1 space-y-4">
                            {/* About Card */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-green-800 mb-1">About</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {user?.bio || "Hey there! I am using QuickChat."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                                        <MdEmail className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-medium text-gray-500">Email Address</h3>
                                        <p className="text-gray-800 text-sm font-medium break-all">
                                            {user?.email || "user@example.com"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Created Card */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                                        <MdCalendarToday className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-medium text-gray-500">Member Since</h3>
                                        <p className="text-gray-800 text-sm font-medium">
                                            {user?.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : "Unknown date"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition shadow-sm"
                        >
                            Go to Home
                        </button>
                        <button
                            onClick={() => navigate("/profile")}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2 shadow-md"
                        >
                            <FaEdit />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;