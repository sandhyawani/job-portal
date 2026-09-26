import mongoose from "mongoose";
import dns from "dns";

// Ensure Atlas SRV resolution succeeds across all local DNS configurations
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

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