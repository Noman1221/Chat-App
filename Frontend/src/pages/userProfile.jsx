import { useContext } from "react";
import img1 from "../assets/img1.jpg";
import { authContext } from "../context/authContext";

function UserProfile() {
    let { user } = useContext(authContext);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div className="bg-green-500 p-6 text-white">
                    <h1 className="text-2xl font-bold">Profile</h1>
                </div>

                {/* Profile Image and Name */}
                <div className="flex flex-col items-center px-6 py-8 -mt-12">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center mb-4 border-4 border-white shadow overflow-hidden">
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={img1}
                                    alt="Default"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="absolute bottom-4 right-0 bg-green-500 rounded-full p-1.5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mt-2">{user?.fullname || "User Name"}</h2>
                    <p className="text-gray-500">{user?.email || "user@example.com"}</p>
                </div>

                {/* User Information */}
                <div className="px-6 pb-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">About</h3>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                            {user?.bio || "Hey there! I am using WhatsApp."}
                        </p>
                    </div>



                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Account Created</h3>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown date"}
                        </p>
                    </div>
                </div>






            </div>
        </div>
    );
}

export default UserProfile;