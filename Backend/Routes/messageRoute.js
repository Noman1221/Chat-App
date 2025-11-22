// This file defines all message - related API routes.
//     I’m using Express Router to organize routes cleanly

// Import Express for routing, Multer for image uploads, and Cloudinary storage setup for saving images online
import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, messageSend } from "../Controllers/messageController.js";
// and middleware that ensures only logged -in users can access routes.
import { isAuthenticate } from "../middleware/isAuthenticate.js";
const upload = multer({ storage })
const router = express.Router();

// Gets all users except the logged -in one(for sidebar list).
router.get("/users", isAuthenticate, getUsersForSidebar);
// Fetches all messages between the logged -in user and the selected user.
router.get("/:id", isAuthenticate, getMessages);
// Marks messages from that user as seen.
router.put('/mark/:id', isAuthenticate, markMessageAsSeen);
// Sends a message(with or without image) to the selected user.
// ➡ Multer handles the image upload before saving.
router.post("/:id", isAuthenticate, upload.single("image"), messageSend);
export default router