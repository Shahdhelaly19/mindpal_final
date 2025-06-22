import { Reminder } from "../../../databases/models/reminder.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { Medicine } from "../../../databases/models/medicine.model.js";
import { Patient } from "../../../databases/models/patient.model.js";
import { scheduleSingleReminder } from "../../cron/singleReminderScheduler.js"; 
import moment from "moment-timezone";

export const addReminder = catchError(async (req, res, next) => {
  const { patientId, medicineId, time } = req.body;

  const medicine = await Medicine.findById(medicineId);
  if (!medicine) return next(new AppError("Medicine not found", 404));

  const patient = await Patient.findById(patientId);
  if (!patient) return next(new AppError("Patient not found", 404));

  const cairoTime = moment.tz(time, "Africa/Cairo");
  const nowInCairo = moment.tz("Africa/Cairo");

  if (cairoTime.isBefore(nowInCairo)) {
    return next(new AppError("Time must be in the future", 400));
  }

  const newReminder = await Reminder.create({
    patientId,
    medicineId,
    time: cairoTime.toDate(),
    createdBy: req.user?.userId || null,
  });

  if (patient.deviceTokens) {
    scheduleSingleReminder(
      cairoTime.toDate(),
      patient.deviceTokens,
      { name: medicine.name, dose: medicine.dose },
      newReminder._id
    );
    // console.log("✅ Reminder scheduled after creation.");
  }

  res.status(201).json({ message: "Reminder created", reminder: newReminder });
});


export const getRemindersByMedicine = catchError(async (req, res, next) => {
  const { medicineId } = req.params;

  const reminders = await Reminder.find({ medicineId });

  res.status(200).json({
    message: "✅ Reminders for medicine retrieved successfully",
    reminders,
  });
});
