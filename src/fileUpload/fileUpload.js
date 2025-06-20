import multer from "multer";
import { AppError } from "../utils/appError.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloud.js";

const fileUpload = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName || "aiPhoto", // اسم المجلد على Cloudinary
      allowed_formats: ["png", "jpg", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Images only allowed", 401), false);
    }
  }

  const upload = multer({
    storage,
    fileFilter,
  });

  return upload;
};

// ** middleware رفع ملف واحد، اختياري **
export const uploadSingleFileOptional = (fileName) => (req, res, next) => {
  const middleware = fileUpload().single(fileName);
  middleware(req, res, (err) => {
    if (err) return next(err); // لو في خطأ في الرفع (زي نوع ملف غلط)
    // لو مفيش ملف مرفوع (req.file = undefined) مش مشكلة، استمر عادي
    next();
  });
};

// رفع ملف واحد، إلزامي (لو حابة تستخدميها)
// export const uploadSingleFile = (fileName) => fileUpload().single(fileName);
