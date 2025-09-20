import { useState } from "react";
import { FaCheck, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";

function RightSidebar({ selectUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedBio, setEditedBio] = useState(selectUser?.bio || "");

    const handleSaveBio = () => {
        // Here you would typically make an API call to save the bio
        console.log("Saving bio:", editedBio);
        setIsEditing(false);

        // Update the user's bio in the parent component if needed
        // This would require passing a callback function as a prop
    };

    const handleCancelEdit = () => {
        setEditedBio(selectUser?.bio || "");
        setIsEditing(false);
    };

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-50 border-l border-gray-200 z-30 flex flex-col transition-transform duration-300">
            {/* Profile Section */}
            <div className="flex flex-col items-center p-6 border-b border-gray-200">
                <img
                    src={selectUser?.profilePicture || img1}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {selectUser?.fullname || "Unknown User"}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{selectUser?.email || "No email provided"}</p>

                {/* Bio Section */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Bio</h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}

                                className="text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {selectUser && (
                                    <Link to="/profile" className="text-gray-700 hover:text-blue-500">
                                        <FaUserCircle size={24} /> {/* icon replaces "profile" text */}
                                    </Link>
                                )}

                                {/* <FaEdit size={14} /> */}
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSaveBio}
                                    className="text-green-500 hover:text-green-600 transition-colors"
                                >
                                    <FaCheck size={14} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <textarea
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            rows="3"
                            placeholder="Tell something about yourself..."
                        />
                    ) : (
                        <p className="text-gray-700 text-sm bg-white p-3 rounded-md border border-gray-200 min-h-12">
                            {selectUser?.bio || "No bio available"}
                        </p>
                    )}
                </div>
            </div>

            {/* Additional Info Section - Scrollable if needed */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                    <h3 className="text-gray-500 text-sm font-medium mb-3">Details</h3>
                    <div className="space-y-3">


                        <div>

                            <p className="text-sm text-gray-700">
                                {selectUser?.joinDate
                                    ? new Date(selectUser.joinDate).toLocaleDateString()
                                    : ""
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-3">Media Shared</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Media {item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightSidebar;