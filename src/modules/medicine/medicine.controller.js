import { Medicine } from "../../../databases/models/medicine.model.js";
import { Patient } from "../../../databases/models/patient.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";


export const addMedicine = catchError(async(req , res , next) => {
    
 
  let patient = await Patient.findOne({code:req.body.code})
    if (!patient || patient.role !== "patient") {
    return next(new AppError("Patient code is required", 400));
  }

  const { name, dosage, schedule, type, startDate, endDate } = req.body;

  const newMed = await Medicine.create({
    name,
    dosage,
    schedule,
    type,
    startDate,
    endDate,
    prescribedTo: patient._id
  });

  res.status(201).json({
    message: "Medication added successfully",
    medication: newMed
  });
})


export const updateMedicine = catchError(async(req , res , next) => {

   const  medicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )

    res.status(200).json({
    message: "Medication updated successfully",
    medication: medicine,
  });
    
})


export const deleteMedicine = catchError(async(req , res , next) => {
 
    const medicine = await Medicine.findByIdAndUpdate(req.params.id ,{confirm:false})
    res.status(200).json({
    message: "Medication deleted successfully",
  });
    
})
