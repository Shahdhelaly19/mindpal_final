import cron from "node-cron";
import { Response } from "../../databases/models/response.model.js";
import { Reminder } from "../../databases/models/reminder.model.js";
import { Patient } from "../../databases/models/patient.model.js";
import { sendNotification } from "../utils/sendNotification.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("🕐 Re-send skipped reminders cron started:", new Date().toLocaleString());

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const skippedResponses = await Response.find({
      status: "skip",
      respondedAt: { $lte: fiveMinutesAgo },
      resent: { $ne: true }
    }).populate("reminderId").populate("patientId");

    console.log("🧠 Skipped responses found:", skippedResponses.length);

    for (const response of skippedResponses) {
      const reminder = response.reminderId;
      const patient = response.patientId;

      console.log("🔁 Resending to patient:", patient?.name || patient?._id);

    if (patient?.deviceTokens) {
  await sendNotification(
    patient.deviceTokens,
    "Medicine Reminder (Repeated)",
    `You skipped your dose earlier: ${reminder.medicineId?.name || "your medicine"}. Please take it now if possible.`
  );
      } else {
          console.warn("⚠️ No deviceTokens found for patient:", patient._id);
  }

      response.resent = true;
      await response.save();
      console.log(`🟢 Marked as resent for response: ${response._id}`);

    }

  } catch (err) {
    console.error("❌ Error in skip rescheduler:", err);
  }
});
