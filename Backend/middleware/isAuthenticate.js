import jwt from "jsonwebtoken";

export const isAuthenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header exists and is well-formed
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing or malformed" });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);


        // Add user info to the request
        req.user = decoded;

        // Move to next middleware
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};