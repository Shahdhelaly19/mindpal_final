import cron from "node-cron";
import { Response } from "../../databases/models/response.model.js";
import { Reminder } from "../../databases/models/reminder.model.js";
import { Patient } from "../../databases/models/patient.model.js";
import { sendNotification } from "../utils/sendNotification.js";

// كل دقيقة نراجع الـ skips اللي فات عليها 5 دقايق
cron.schedule("*/1 * * * *", async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // نجيب كل الـ skips اللي حصلت من أكتر من 5 دقايق ومتبعتش إشعار تاني
    const skippedResponses = await Response.find({
      status: "skip",
      respondedAt: { $lte: fiveMinutesAgo },
      resent: { $ne: true } // هنضيف دي علشان مايبعتش تاني
    }).populate("Reminder").populate("Patient");

    for (const response of skippedResponses) {
      const reminder = response.reminder;
      const patient = response.patient;

      if (patient?.deviceToken) {
        await sendNotification(
          patient.deviceToken,
          "Medicine Reminder (Repeated)",
          `You skipped your dose earlier: ${reminder.medicineId?.name || "your medicine"}. Please take it now if possible.`
        );
      }

      // علشان مايبعتش تاني لنفس الـ skip
      response.resent = true;
      await response.save();
    }

  } catch (err) {
    console.error("Error in skip rescheduler:", err);
  }
});
