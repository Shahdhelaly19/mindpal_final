// src/modules/reminder/reminder.controller.js

import { Reminder } from "../../../databases/models/reminder.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { Medicine } from "../../../databases/models/medicine.model.js";

export const addReminder = catchError(async (req, res, next) => {
  const { medicineId, time } = req.body;

  const medicine = await Medicine.findById(medicineId);
  if (!medicine) return next(new AppError("Medicine not found", 404));

  const newReminder = await Reminder.create({
    medicineId,
    time,
    createdBy: req.user.userId
  });
  if (new Date(time) < new Date()) {
  return next(new AppError("Time must be in the future", 400));
}


  res.status(201).json({ message: "Reminder created", reminder: newReminder });
});
