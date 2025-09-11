import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("Cloudinary ENV:", process.env.CLOUDINARY_API_KEY);


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat_user_profiles',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

export { cloudinary, storage };
