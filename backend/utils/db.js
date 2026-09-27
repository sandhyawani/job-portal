import mongoose from "mongoose";
import dns from "dns";

// Ensure DNS resolution for MongoDB Atlas SRV records works reliably across environments
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // If not permitted in environment, proceed with default
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log("mongodb connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message || error);
        throw error;
    }
};

export default connectDB;