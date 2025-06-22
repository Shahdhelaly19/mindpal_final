import { Doctor } from "../../../databases/models/doctor.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";





export const addDoctor = catchError(async(req, res, next) => {
    
    const { name, password} = req.body;
    let doctor = new Doctor({
        name,
        password,
        role: "doctor"
    })
    await doctor.save()
    res.status(201).json({ message: "doctor created successfully", doctor});
})


    


export const deleteDoctor = catchError(async (req, res, next) => {
    const doctor=  await Doctor.findByIdAndDelete(req.params.id);
   return doctor ? res.status(200).json({ message: "doctor deleted successfully"})
                : next(new AppError("doctor not found" , 404))
});


export const allDoctors = catchError(async(req , res , next) => {
     const doctors = await Doctor.find({ role: "doctor"});
       res.status(200).json({ message: "success", doctors });
})

