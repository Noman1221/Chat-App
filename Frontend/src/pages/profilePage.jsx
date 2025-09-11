
import { useContext, useState } from "react";
import { authContext } from "../context/authContext";


function ProfilePage() {
    const { user } = useContext(authContext);
    console.log("yeh alag hai", user);
    const [preview, setPreview] = useState(null);

    // Handle image upload and show preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Update Profile</h2>

                    <input
                        type="text"
                        placeholder="Update Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    <textarea
                        placeholder="Change Bio"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    ></textarea>
                </div>

                {/* Right Column */}
                <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
                    <label htmlFor="fileInput" className="cursor-pointer">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-40 h-40 rounded-full object-cover border-2 border-gray-300 hover:opacity-80 transition"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 hover:bg-gray-300 transition">
                                Click to upload
                            </div>
                        )}
                    </label>

                    {/* Hidden file input */}
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    <p className="text-sm text-gray-600 mt-3">Click image to change</p>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
