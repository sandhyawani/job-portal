import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

app.set("trust proxy", 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 login/register attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes.",
  },
});

app.use("/api/", generalLimiter);
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools without origin header
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Dynamic fallback for any origin if not explicitly listed in env
    // This ensures credentials work even on Vercel preview URLs
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Health check endpoint for uptime monitoring & deployment platforms
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Request origin not allowed.",
      success: false,
    });
  }

  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    console.error("Unhandled Server Error:", err);
  }

  const status = err.status || err.statusCode || 500;
  const message = isProduction && status === 500 ? "Internal server error" : err.message || "Internal server error";

  return res.status(status).json({
    message,
    success: false,
  });
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

export default app;
