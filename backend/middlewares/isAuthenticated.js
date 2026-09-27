import jwt from "jsonwebtoken";

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
        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed or token expired",
            success: false,
        });
    }
};

// Optional auth: sets req.id if valid token exists, but doesn't block if absent
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
        if (token) {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            if (decode && decode.userId) {
                req.id = decode.userId;
            }
        }
    } catch {
        // Continue unauthenticated if token invalid
    }
    next();
};

export default isAuthenticated;

