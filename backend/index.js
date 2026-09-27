import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import "./models/user.model.js";
import "./models/company.model.js";
import "./models/job.model.js";
import "./models/application.model.js";
import "./models/externalApplication.model.js";
import "./models/notification.model.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173").split(",").map((origin) => origin.trim()).filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));

// Health check endpoint for uptime monitoring & deployment platforms
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err.message);
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            message: "CORS error: Request origin not allowed.",
            success: false,
        });
    }
    return res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        success: false,
    });
});

const PORT = process.env.PORT || 8000;

// ✅ Connect DB before starting server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1);
    });
