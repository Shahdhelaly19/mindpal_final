// import dotenv from "dotenv";
// import { Reminder } from "../../databases/models/reminder.model.js";
// import { Medicine } from "../../databases/models/medicine.model.js";
// import { scheduleSingleReminder } from "./singleReminderScheduler.js";
// import { Patient } from "../../databases/models/patient.model.js";
// import moment from "moment-timezone";

// dotenv.config();

// export const scheduleReminders = async () => {
//   console.log("🔁 Loading all reminders...");

//   const reminders = await Reminder.find().populate([
//     {
//       path: 'medicineId',
//       model: Medicine,
//       populate: {
//         path: 'prescribedTo',
//         model: Patient,
//       },
//     },
//     {
//       path: 'patientId',
//       model: Patient,
//     },
//   ]);

//   for (let reminder of reminders) {
//     const medicine = reminder.medicineId;
//     const patient = reminder.patientId;

//     const { name, dose } = medicine;

//     if (patient?.deviceTokens && reminder.time) {
//       console.log(`🔍 Patient: ${patient?.name}, Tokens: ${patient?.deviceTokens}`);

//       const reminderTimeInCairo = moment(reminder.time)
//         .tz("Africa/Cairo")
//         .toDate();

//       scheduleSingleReminder(
//         reminderTimeInCairo,
//         patient.deviceTokens,
//         { name, dose },
//         reminder._id
//       );

//       console.log("✅ Reminder scheduled.");
//     } else {
//       console.log("⚠️ Skipped: Missing deviceToken or time.");
//     }
//   }

//   console.log("✅ All reminders processed.");
// };

import dotenv from "dotenv";
import { Reminder } from "../../databases/models/reminder.model.js";
import { Medicine } from "../../databases/models/medicine.model.js";
import { scheduleSingleReminder } from "./singleReminderScheduler.js";
import { Patient } from "../../databases/models/patient.model.js";
import moment from "moment-timezone";

dotenv.config();

export const scheduleReminders = async () => {
  console.log("🔁 Loading all reminders...");

  const reminders = await Reminder.find().populate([
    {
      path: 'medicineId',
      model: Medicine,
      populate: {
        path: 'prescribedTo',
        model: Patient,
      },
    },
    {
      path: 'patientId',
      model: Patient,
    },
  ]);

  for (let reminder of reminders) {
    const medicine = reminder.medicineId;
    const patient = reminder.patientId;

    const { name, dose } = medicine;

    if (patient?.deviceTokens && reminder.time) {
      console.log(`🔍 Patient: ${patient?.name}, Tokens: ${patient?.deviceTokens}`);

      // تحويل الوقت لتوقيت القاهرة
      const reminderTimeInCairo = moment(reminder.time).tz("Africa/Cairo");

      // طباعة الوقت المصري للمساعدة في تتبع المواعيد
      console.log("⏰ Scheduled at (Egypt Time):", reminderTimeInCairo.format("YYYY-MM-DD HH:mm:ss"));

      // تحويله لـ Date علشان يتسجل في setTimeout أو غيره
      scheduleSingleReminder(
        reminderTimeInCairo.toDate(),
        patient.deviceTokens,
        { name, dose },
        reminder._id
      );

      console.log("✅ Reminder scheduled.");
    } else {
      console.log("⚠️ Skipped: Missing deviceToken or time.");
    }
  }

  console.log("✅ All reminders processed.");
};
