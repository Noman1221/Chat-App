import jwt from "jsonwebtoken";
import user from "../Models/AuthModel.js";
export const isAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing or malformed" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Fetch the complete user from database
        const User = await user.findById(decoded.userId).select("-password"); // Exclude password

        if (!User) {
            return res.status(401).json({ message: "User not found" });
        }

        // Add full user info to the request
        req.user = User;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};