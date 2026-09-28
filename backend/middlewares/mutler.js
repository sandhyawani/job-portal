import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedImageMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const allowedImageExts = [".jpg", ".jpeg", ".png", ".webp"];

const allowedDocMimes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const allowedDocExts = [".pdf", ".doc", ".docx"];

const allowedAllMimes = [...allowedImageMimes, ...allowedDocMimes];
const allowedAllExts = [...allowedImageExts, ...allowedDocExts];

// General upload (profile can accept either photo or resume)
const uploadAll = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (allowedAllMimes.includes(file.mimetype) && allowedAllExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Allowed: JPG, PNG, WEBP, PDF, DOC, DOCX."), false);
    }
  },
});

// Image-only upload (Company logo, avatar)
const uploadImageOnly = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (allowedImageMimes.includes(file.mimetype) && allowedImageExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP) up to 2MB are allowed."), false);
    }
  },
});

export const singleUpload = (req, res, next) => {
  uploadAll.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds the 5MB limit.",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed.",
      });
    }
    next();
  });
};

export const imageUpload = (req, res, next) => {
  uploadImageOnly.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Image size exceeds the 2MB limit.",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed.",
      });
    }
    next();
  });
};

export default singleUpload;
