// src/modules/patient/patient.report.controller.js
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { Patient } from "../../../databases/models/patient.model.js";
import { Reminder } from "../../../databases/models/reminder.model.js";
import { Response } from "../../../databases/models/response.model.js";
import { Medicine } from "../../../databases/models/medicine.model.js";
import { Scan } from "../../../databases/models/scan.model.js";

export const getFullPatientReport = catchError(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate("doctorId", "name");
  if (!patient) return next(new AppError("Patient not found", 404));

  const reminders = await Reminder.find({ patientId: patient._id }).populate("medicineId");
  const responses = await Response.find({ patientId: patient._id }).populate("reminderId");
  const medicines = await Medicine.find({ prescribedTo: patient._id });
  const scans = await Scan.find({ uploadedTo: patient._id });

  res.status(200).json({
    message: "Full patient report fetched successfully",
    patient: {
      ...patient.toObject(),
      reminders,
      responses,
      medicines,
      scans
    }
  });
});
