import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String, required: true,
    },
    email: {
        type: String, required: true, unique: true,
    },
    password: {
        type: String, required: true, minLength: 6,
    },
    profilePicture: {
        path: String,
        filename: String,
        // default: ""
    },
    bio: {
        type: String,
        default: "",
    },
}, { timestamps: true },);


const user = mongoose.model("User", userSchema);
export default user
