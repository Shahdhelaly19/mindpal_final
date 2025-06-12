import { Patient } from "../../databases/models/patient.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";




export const canAccessPatientData = catchError(async(req, res, next) => {
  
    
    const loggedInUser = req.user; 
    const patientId = req.params.id;
    
    const patient = await Patient.findById(patientId);

        if (!patient || patient.role !== "patient") {
            return next(new AppError("Patient not found", 404));
        }
    
    if (loggedInUser.role === "patient" && loggedInUser.userId === patientId) {
            return next();
    }
    
   
    if (loggedInUser.role === "doctor" && patient.doctorId?.toString() === loggedInUser.userId) {
           return next();
    }
    
    if (loggedInUser.role === "admin") {
       return next()
    }
        
    
    return next(new AppError("Forbidden: You don't have access to this patient data", 403));
    
})