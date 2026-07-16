import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
}
export default connectDB;