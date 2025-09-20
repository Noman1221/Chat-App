import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";

function ProfilePage() {
    const navigate = useNavigate();
    const { updateUserProfile } = useContext(authContext);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState(null);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!name || !bio || (!file && !preview)) return;

        try {
            const res = await updateUserProfile(name, bio, file);
            // Make sure res has the updated user
            if (res && res.user) {
                // redirect to home page
                navigate("/", { replace: true });
            } else {
                console.error("Update failed: no user returned", res);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Name & Bio */}
                <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Update Profile</h2>
                    <input
                        type="text"
                        placeholder="Update Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    <textarea
                        placeholder="Change Bio"
                        rows="4"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Right: Profile Image */}
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

            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
