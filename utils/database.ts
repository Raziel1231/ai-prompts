import mongoose from "mongoose";

export const connectToDB = async() => {
    mongoose.set("strictQuery", true);
    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("DB Connected")
    } catch (error) {
        console.log(error);
        throw new Error("Can't initiate database");
    }
}