

import axios from "axios";
import { catchError } from "./catchError.js";
import { AppError } from "../utils/appError.js";
import FormData from'form-data'
import { Scan } from "../../databases/models/scan.model.js";

export const analyzeScan = catchError(async (req, res, next) => {
    let scan = req.savedScan;
    
    
    
    if (!scan) {
        return next(new AppError("not found scan" , 400));
    }

    try {

    const form = new FormData();
    form.append("image_url", scan.filePath);
        
    const aiResponse = await axios.post(
        "https://alz-apiri.onrender.com/predict",
       form,
       { headers: form.getHeaders() }
    );


   if (aiResponse.data) {
            scan.analyzed = true;
            scan.analysisResult = aiResponse.data.prediction;
            await scan.save();
        }


        scan = await Scan.findById(scan._id) .populate({
        path: 'uploadedTo',
        select: 'name doctorId',
        populate: {
            path: 'doctorId',
            select: 'name'
        }
     });
        res.status(201).json({
            message: "Scan uploaded and analyzed",
            scan: {
                ...scan.toObject(),
                uploadedTo: scan.uploadedTo.name,
                 doctorName: scan.uploadedTo.doctorId?.name || "Unknown"
                
            }
        });

      

    } catch (error) {
         console.error("AI analysis failed:", error.response ? error.response.data : error.message);
         return next(new AppError("AI analysis failed:" , 401))
    }


    // console.log(scan);
    

    // res.status(201).json({
    //     message: "Scan uploaded and analyzed",
    //     scan
    // });
});
