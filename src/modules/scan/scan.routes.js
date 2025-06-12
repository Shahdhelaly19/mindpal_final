import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addScan } from "./scan.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { analyzeScan } from "../../middleware/scanAiModel.js";



const scanRouter = Router()

scanRouter.post('/', protectedRoutes, allowedTo('Radiologist'),
    uploadSingleFile("scan"), addScan, analyzeScan)
    


export default scanRouter