import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/AuthModel.js";

// sign Up for new User 

export const signup = async (req, res) => {
    try {
        console.log(req.body);

        let { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "missing details" });
        };
        console.log(fullname, email, password);

        const isUser = await User.findOne({ email });
        console.log(isUser);

        if (isUser) {
            return res.status(400).json({ message: "user already exist" });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        if (!hashedPass) {
            return res.status(400).json({ message: "password not hashed" });
        }
        const newUser = User({
            fullname,
            email,
            password: hashedPass,
        });
        await newUser.save();
        let token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
        if (!token) {
            return res.status(404).json({ message: "Token not created" });
        };
        res.status(200).json({ userData: newUser, token, message: "user created successfully" })
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: error });
    };
};


export const login = async (req, res) => {


    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "missing details" });
        };

        const isUser = await User.findOne({ email });


        if (!isUser) {
            return res.status(400).json({ message: "user not found" });
        }

        const isCompare = await bcrypt.compare(password, isUser.password);
        if (!isCompare) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        let token = jwt.sign({ userId: isUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
        res.status(200).json({
            isUser,
            token,
            message: "user login successesfully"
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: error });
    }
}


export const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }


    res.json({ user: req.user });
};


export const updateUserProfile = async (req, res) => {
    try {
        const { fullname, bio } = req.body;
        const userId = req.user.userId;

        let updatedFields = { fullname, bio };

        // // multer + cloudinary already gives url in file.path
        if (req.file) {
            updatedFields.profilePicture = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true }
        );

        res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};