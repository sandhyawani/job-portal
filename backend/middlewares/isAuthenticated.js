import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode || !decode.userId) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User not found or session expired",
                success: false,
            });
        }

        req.id = user._id.toString();
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed or token expired",
            success: false,
        });
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Insufficient permissions for this role.",
                success: false,
            });
        }
        next();
    };
};

// Optional auth: sets req.id and req.user if valid token exists, but doesn't block if absent
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
        if (token) {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            if (decode && decode.userId) {
                const user = await User.findById(decode.userId).select("-password");
                if (user) {
                    req.id = user._id.toString();
                    req.user = user;
                }
            }
        }
    } catch {
        // Continue unauthenticated if token invalid
    }
    next();
};

export default isAuthenticated;

