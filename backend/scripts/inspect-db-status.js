import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../utils/db.js";
import { Application } from "../models/application.model.js";

const inspect = async () => {
  try {
    await connectDB();
    const total = await Application.countDocuments();
    const statusCounts = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    console.log("------------------------------------------");
    console.log("📊 PRODUCTION DATABASE APPLICATION AUDIT");
    console.log("------------------------------------------");
    console.log(`Total Applications: ${total}`);
    console.log("Status Breakdown:", statusCounts);

    // Also check if any applications lack statusHistory
    const noHistoryCount = await Application.countDocuments({
      $or: [{ statusHistory: { $exists: false } }, { statusHistory: { $size: 0 } }],
    });
    console.log(`Applications without statusHistory: ${noHistoryCount}`);
    console.log("------------------------------------------");
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

inspect();
