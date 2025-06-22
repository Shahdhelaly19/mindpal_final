// src/modules/response/response.controller.js

import { Response } from "../../../databases/models/response.model.js";
import { Reminder } from "../../../databases/models/reminder.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

export const giveResponse = catchError(async (req, res, next) => {
  const { reminderId, status } = req.body;

  const reminder = await Reminder.findById(reminderId);
  if (!reminder) return next(new AppError("Reminder not found", 404));

const newResponse = await Response.create({
  reminderId,
  patientId: req.user.userId,
  status,
  respondedAt: new Date() // ✅ أهو دا المهم
});


  res.status(201).json({ message: "Response saved", response: newResponse });
});
