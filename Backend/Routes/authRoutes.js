import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import {
    getCurrentUser,
    login,
    signup,
    updateUserProfile
} from "../Controllers/AuthController.js";
import { isAuthenticate, } from "../middleware/isAuthenticate.js";
import { ValidateSignUp, validate } from "../middleware/validators.js";
const upload = multer({ storage });
// import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", ValidateSignUp, validate, signup);
router.post("/login", login);
router.get("/me", isAuthenticate, getCurrentUser);


router.put("/updateProfile", isAuthenticate, upload.single("profilePicture"), updateUserProfile);

export default router;
