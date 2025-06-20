import cron from "node-cron";
import { Response } from "../../databases/models/response.model.js";
import { Reminder } from "../../databases/models/reminder.model.js";
import { Patient } from "../../databases/models/patient.model.js";
import { sendNotification } from "../utils/sendNotification.js";

// علشان اخليه يلف على كل ال reminders اللى عملتها كل دقيقة
cron.schedule("*/1 * * * *", async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

// يبعت له ال nothification تانى بعد 5 دقايق
    const skippedResponses = await Response.find({
      status: "skip",
      respondedAt: { $lte: fiveMinutesAgo },
      resent: { $ne: true }
    }).populate("ReminderId").populate("PatientId");

    for (const response of skippedResponses) {
      const reminder = response.reminderId;
      const patient = response.patientId;

      if (patient?.deviceToken) {
        await sendNotification(
          patient.deviceTokens,
          "Medicine Reminder (Repeated)",
          `You skipped your dose earlier: ${reminder.medicineId?.name || "your medicine"}. Please take it now if possible.`
        );
      }

      response.resent = true;
      await response.save();
    }

  } catch (err) {
    console.error("Error in skip rescheduler:", err);
  }
});
