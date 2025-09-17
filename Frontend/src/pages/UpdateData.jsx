import { useLocation } from "react-router-dom";

function UpdateData() {
    const location = useLocation();
    const { message, user } = location.state || {}; // ✅ get data

    if (!user) return <p>No profile data available</p>;

    return (
        <div className="mt-6 p-4 bg-white shadow rounded-xl">
            <p className="text-green-600 font-semibold">{message}</p>
            <div className="mt-4 space-y-2">
                <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
                <p><strong>Name:</strong> {user.fullname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Bio:</strong> {user.bio}</p>
            </div>
        </div>
    );
}

export default UpdateData;
