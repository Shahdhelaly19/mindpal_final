import { Reminder } from "../../../databases/models/reminder.model.js";
import { Response } from "../../../databases/models/response.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

export const getReminderStats = catchError(async (req, res, next) => {
  const patientId = req.params.id;

  const reminders = await Reminder.find({ patientId });
  const responses = await Response.find({ patientId });

  const totalReminders = reminders.length;
  const totalResponses = responses.length;
  const checkedCount = responses.filter(r => r.status === "taken").length;
  const skippedCount = responses.filter(r => r.status === "skipped").length;
  const adherenceRate = totalResponses ? Math.round((checkedCount / totalResponses) * 100) : 0;

  res.status(200).json({
    message: "success",
    stats: {
      totalReminders,
      totalResponses,
      checkedCount,
      skippedCount,
      adherenceRate: `${adherenceRate}%`
    }
  });
});
