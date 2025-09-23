import img1 from "../assets/img1.jpg";

function RightSidebar({ selectUser, messages }) {
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
                <p className="text-gray-600 text-sm mb-4">
                    {selectUser?.email || "No email provided"}
                </p>

                {/* Bio Section */}
                {selectUser?.bio && (
                    <div className="w-full mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Bio</h3>
                        <p className="text-gray-700 text-sm bg-white p-3 rounded-md border border-gray-200 min-h-12">
                            {selectUser.bio}
                        </p>
                    </div>
                )}
            </div>

            {/* Additional Info Section - Scrollable if needed */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Details */}
                <div className="mb-6">
                    <h3 className="text-gray-500 text-sm font-medium mb-3">Details</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-700">
                                {selectUser?.joinDate
                                    ? new Date(selectUser.joinDate).toLocaleDateString()
                                    : ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Media Shared */}
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-3">Media Shared</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {messages
                            .filter((item) => item.image) // only messages with image
                            .map((item) => (
                                <div
                                    key={item._id}
                                    className="aspect-square bg-gray-200 rounded-md overflow-hidden"
                                >
                                    <img
                                        src={item.image}
                                        alt="shared"
                                        className="w-full h-full object-cover" // all images same size
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightSidebar;
