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
    const [loading, setLoading] = useState(false); // ADD THIS
    const [error, setError] = useState(""); // ADD THIS
    const { signup, login } = auththings;

    function toggleForm() {
        try {
            setIsSignLog(isSignLog === "Signup" ? "Login" : "Signup");
            setFullname("");
            setEmail("");
            setPassword("");
            setError(""); // Clear error on toggle
        } catch (error) {
            console.log(error);
        }
    }

    async function handleForm(e) {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true); // Start loading

        try {
            if (isSignLog === "Signup") {
                const result = await signup(fullname, email, password);
                if (result) {
                    navigate("/profile"); // Go to profile setup
                } else {
                    setError("Signup failed. Please try again.");
                }
            } else {
                const result = await login(email, password);
                if (result) {
                    navigate("/"); // Go to home page
                } else {
                    setError("Login failed. Please check your credentials.");
                }
            }
            setFullname("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.log(error);
            setError(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isSignLog}
                </h3>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleForm} className="space-y-4">
                    {/* Full Name (only for signup) */}
                    {isSignLog === "Signup" && (
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Full Name"
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>{isSignLog === "Signup" ? "Signing up..." : "Logging in..."}</span>
                            </>
                        ) : (
                            isSignLog
                        )}
                    </button>
                </form>

                {/* Toggle login/signup */}
                <p className="text-center text-gray-600 mt-4">
                    {isSignLog === "Signup" ? (
                        <>
                            Already have an account?{" "}
                            <span
                                className="text-green-500 cursor-pointer hover:underline font-medium"
                                onClick={toggleForm}
                            >
                                Login
                            </span>
                        </>
                    ) : (
                        <>
                            Create an account?{" "}
                            <span
                                className="text-green-500 cursor-pointer hover:underline font-medium"
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