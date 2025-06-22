// src/modules/response/response.controller.js

import { Response } from "../../../databases/models/response.model.js";
import { Reminder } from "../../../databases/models/reminder.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

export const giveResponse = catchError(async (req, res, next) => {
  const { reminderId, status } = req.body;

  // ✅ تحقق من صحة القيمة
  if (!["taken", "skipped"].includes(status)) {
    return next(new AppError("Status must be either 'taken' or 'skipped'", 400));
  }

  // ✅ تأكد إن الريمايندر موجود
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) return next(new AppError("Reminder not found", 404));

  // ✅ إنشاء الرد
  const newResponse = await Response.create({
    reminderId,
    patientId: req.user.userId,
    status,
    respondedAt: new Date()
  });

  // ✅ تحديث الريمايندر نفسه
  await Reminder.findByIdAndUpdate(reminderId, { status });

  res.status(201).json({
    message: `✅ Response saved and reminder marked as '${status}'`,
    response: newResponse
  });
});
