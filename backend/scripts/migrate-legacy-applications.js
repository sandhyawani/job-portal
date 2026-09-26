import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../utils/db.js";
import { Application } from "../models/application.model.js";

const migrate = async () => {
  try {
    console.log("--------------------------------------------------");
    console.log("🚀 STARTING SAFE LEGACY APPLICATION MIGRATION");
    console.log("--------------------------------------------------");

    await connectDB();

    // Find applications without statusHistory
    const legacyApps = await Application.find({
      $or: [{ statusHistory: { $exists: false } }, { statusHistory: { $size: 0 } }],
    });

    console.log(`Found ${legacyApps.length} applications without statusHistory.`);

    let updatedCount = 0;
    for (const app of legacyApps) {
      const initialEntry = {
        status: app.status || "applied",
        changedAt: app.createdAt || new Date(),
        changedBy: app.applicant,
        comment: `Historical record initialized from creation date (${app.status || "applied"})`,
      };

      app.statusHistory = [initialEntry];
      await app.save();
      updatedCount++;
    }

    console.log(`✓ Successfully populated statusHistory for ${updatedCount} legacy applications.`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

migrate();
