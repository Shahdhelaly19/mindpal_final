import { Patient } from "../../../databases/models/patient.model.js";
import { Scan } from "../../../databases/models/scan.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";






export const addScan = catchError(async (req, res, next) => {

    if (!req.file) {
        return next(new AppError("No file uploaded", 400));
    }
   let patient = await Patient.findOne({ code: req.body.code })
   if (!patient) {
    return next(new AppError("this patient not found in system", 401));
   }
   
    const scanData = {
        filePath: req.file.path,
        uploadedTo: patient._id,
    };

    let scan = new Scan(scanData)
    
    await scan.save()
     
    req.savedScan = scan;
    next();
});





