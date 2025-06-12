import { Admin } from "../../databases/models/admin.model.js";
import { Doctor } from "../../databases/models/doctor.models.js";
import { Patient } from "../../databases/models/patient.model.js";
import { AppError } from "../utils/appError.js";





export const roleBehavior = (req, res, next) => {
    let { role } = req.body 
     
    if (role == "patient") {
        req.info = Patient
        return next();
    }

     if (role == "doctor") {
        req.info = Doctor
        return next();
    }

      if (role == "admin") {
        req.info = Admin
        return next();
    }

    return next(new AppError("Invalid role", 400));
}