import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, messageSend } from "../Controllers/messageController.js";
import { isAuthenticate } from "../middleware/isAuthenticate.js";
const upload = multer({ storage })
const router = express.Router();

router.get("/users", isAuthenticate, getUsersForSidebar);
router.get("/:id", isAuthenticate, getMessages);
router.put('/mark/:id', isAuthenticate, markMessageAsSeen);
router.post("/:id", isAuthenticate, upload.single("image"), messageSend);
export default router