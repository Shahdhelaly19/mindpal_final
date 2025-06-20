import { Patient } from "../../../databases/models/patient.model.js";
import { Scan } from "../../../databases/models/scan.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { encryptFile, decryptFile } from "../../utils/crypto.js";

import axios from "axios";
import fs from "fs";
import path from "path";


const downloadImage = async (url, filename) => {
  try {
    if (!fs.existsSync("temp")) fs.mkdirSync("temp");
    const filePath = path.join("temp", filename);
    const response = await axios({
      method: "get",
      url,
      responseType: "arraybuffer",
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0",
      },
      maxRedirects: 5
    });
    if (!response.data || response.data.length < 100) {
      throw new Error("Image download failed or empty.");
    }
    fs.writeFileSync(filePath, response.data);
    if (!fs.existsSync(filePath)) {
      throw new Error("Failed to save the image locally.");
    }
    return filePath;
  } catch (error) {
    console.error("❌ Download image error:", error.message);
    throw new Error(`Input file is missing or failed to download: ${url}`);
  }
};


//  رفع صورة وتشفيرها سواء من الجهاز أو Cloudinary
export const addScan = catchError(async (req, res, next) => {
  const { code, password, imageUrl } = req.body;
  console.log("📸 req.file:", req.file);
console.log("🌐 req.body.imageUrl:", imageUrl);


  if (!password) return next(new AppError("Password is required", 400));

  const patient = await Patient.findOne({ code });
  if (!patient) return next(new AppError("This patient not found", 401));

  let localPath = "";
  let filename = "";

 if (imageUrl) {
  filename = `cloudScan-${Date.now()}.jpg`;
  localPath = await downloadImage(imageUrl, filename);

  console.log("✅ Local path after download:", localPath);
} else if (req.file) {
  filename = `uploadedScan-${Date.now()}.jpg`;
  localPath = await downloadImage(req.file.path, filename); // نحمل من URL Cloudinary

  console.log("✅ Local path from upload (Cloudinary URL):", localPath);
} else {
  return next(new AppError("No image file or imageUrl provided", 400));
}

  //  تشفير الصورة
  const encryptedBuffer = await encryptFile(localPath, password);
  const encryptedPath = path.join("uploads", filename + ".enc");
  fs.writeFileSync(encryptedPath, encryptedBuffer);

  //  حذف الصورة الأصلية
  if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

  //  حفظ الـ Scan فى ال DB
  const scan = await Scan.create({
    filePath: encryptedPath,
    uploadedTo: patient._id,
  });

  res.status(201).json({ message: "Scan uploaded and encrypted", scan });
});

//  فك التشفير وإرجاع الصورة
export const getDecryptedScan = catchError(async (req, res, next) => {
  const { scanId, password } = req.body;

  const scan = await Scan.findById(scanId);
  if (!scan) return next(new AppError("Scan not found", 404));

  const encryptedBuffer = fs.readFileSync(scan.filePath);
  const outputPath = path.join("temp", `decrypted-${Date.now()}.jpg`);

  await decryptFile(encryptedBuffer, password, outputPath);

  const imageBuffer = fs.readFileSync(outputPath);
  res.set("Content-Type", "image/jpeg");
  res.send(imageBuffer);

  // لحذف الصورة بعد الإرسال  
  // fs.unlinkSync(outputPath);
});
