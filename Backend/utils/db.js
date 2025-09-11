import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const ConnectToDb = async () => {
    await mongoose.connect(process.env.MONGO_URL)
};

ConnectToDb().then(() => {
    console.log("database connceted");
}).catch((err) => {
    console.log(err);
})