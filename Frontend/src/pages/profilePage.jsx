import { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";

function ProfilePage() {
    const navigate = useNavigate();
    const { updateUserProfile, fetchCurrentUser, user } = useContext(authContext);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Pre-fill with existing user data
    useEffect(() => {
        if (user) {
            setName(user.fullname || "");
            setBio(user.bio || "");
            if (user.profilePicture) {
                setPreview(user.profilePicture);
            }
        }
    }, [user]);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        if (!bio.trim()) {
            setError("Bio is required");
            return;
        }
        if (!file && !preview) {
            setError("Profile picture is required");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await updateUserProfile(name, bio, file);

            if (res && res.user) {
                await fetchCurrentUser();
                navigate("/", { replace: true });
            } else {
                setError("Update failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white relative">
                    <button
                        onClick={() => navigate("/")}
                        className="absolute left-4 top-6 p-2 rounded-full hover:bg-green-700 transition"
                    >
                        <FaArrowLeft size={18} />
                    </button>
                    <h1 className="text-2xl font-bold text-center">
                        {user?.fullname ? "Edit Profile" : "Complete Your Profile"}
                    </h1>
                    <p className="text-center text-green-100 text-sm mt-1">
                        {user?.fullname ? "Update your information" : "Let's set up your profile"}
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Profile Image */}
                        <div className="flex flex-col items-center md:w-1/3">
                            <label htmlFor="fileInput" className={`cursor-pointer group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {preview ? (
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Profile Preview"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg group-hover:opacity-90 transition"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center border-4 border-dashed border-green-400 hover:border-green-500 transition group">
                                        <div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-xs text-green-700 font-medium">Add Photo</p>
                                        </div>
                                    </div>
                                )}
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Click to {preview ? "change" : "upload"} photo
                            </p>
                        </div>

                        {/* Right: Name & Bio */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    placeholder="Tell us about yourself..."
                                    rows="3"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition resize-none"
                                />
                            </div>

                            {/* Current Info Display (if exists) */}
                            {user?.fullname && (
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <p className="text-xs text-green-800 font-medium mb-1">Current Information:</p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Name:</span> {user.fullname}
                                    </p>
                                    {user.bio && (
                                        <p className="text-sm text-gray-700 mt-1">
                                            <span className="font-medium">Bio:</span> {user.bio}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSkip}
                            disabled={loading}
                            className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Skip for Now
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-md"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;