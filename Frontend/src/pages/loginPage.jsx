import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";

function LoginPage() {
    const auththings = useContext(authContext);
    const navigate = useNavigate();
    const [isSignLog, setIsSignLog] = useState("Signup");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, login } = auththings;

    function toggleForm() {
        setIsSignLog(isSignLog === "Signup" ? "Login" : "Signup");
        setFullname("");
        setEmail("");
        setPassword("");
    }

    async function handleForm(e) {
        e.preventDefault();
        if (isSignLog === "Signup") {
            await signup(fullname, email, password);
            navigate("/profile");
        } else {
            await login(email, password);
            navigate("/");
        }
        setFullname("");
        setEmail("");
        setPassword("");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isSignLog}
                </h3>
                <form onSubmit={handleForm} className="space-y-4">
                    {/* Full Name (only for signup) */}
                    {isSignLog === "Signup" && (
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                    >
                        {isSignLog}
                    </button>
                </form>

                {/* Toggle login/signup */}
                <p className="text-center text-gray-600 mt-4">
                    {isSignLog === "Signup" ? (
                        <>
                            Already have an account?{" "}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={toggleForm}
                            >
                                Login
                            </span>
                        </>
                    ) : (
                        <>
                            Create an account?{" "}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={toggleForm}
                            >
                                Signup
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
