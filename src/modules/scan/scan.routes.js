import { Router } from "express";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
import { addScan, getDecryptedScan } from "./scan.controller.js";
import { uploadSingleFileOptional } from "../../fileUpload/fileUpload.js";
import { analyzeScan } from "../../middleware/scanAiModel.js";

const scanRouter = Router();

// ✅ رفع Scan من Cloudinary أو جهاز المستخدم (يدعم الحالتين)
scanRouter.post( "/",protectedRoutes, 
    allowedTo("Radiologist"),uploadSingleFileOptional("scan"), 
    addScan,analyzeScan
);

scanRouter.post("/view",protectedRoutes,
    allowedTo("doctor"),
    getDecryptedScan
);

export default scanRouter;
