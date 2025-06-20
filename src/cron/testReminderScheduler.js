// // src/cron/testReminderScheduler.js

// import connectDB from "../../databases/dbConnection.js";
// import dotenv from "dotenv";
// import { Reminder } from "../../databases/models/reminder.model.js";
// import { Medicine } from "../../databases/models/medicine.model.js";
// import { Patient } from "../../databases/models/patient.model.js";
// import { sendNotification } from "../utils/sendNotification.js";

// dotenv.config();

// connectDB().then(() => {
//   scheduleTestReminders();
// });

// const scheduleTestReminders = async () => {
//   console.log("🧪 Starting test reminder scheduler...");

//   const reminders = await Reminder.find().populate([
//     {
//       path: "medicineId",
//       model: Medicine,
//       populate: {
//         path: "prescribedTo",
//         model: Patient,
//       },
//     },
//     {
//       path: "patientId",
//       model: Patient,
//     },
//   ]);

//   for (let reminder of reminders) {
//     const medicine = reminder.medicineId;
//     const patient = reminder.patientId;

//     if (patient?.deviceTokens?.length && reminder.time) {
//       const now = new Date();
//       const targetTime = new Date(reminder.time);
//       const delay = targetTime - now;

//       if (delay > 0) {
//         console.log(`⏳ Will send notification to ${patient.name} in ${Math.floor(delay / 1000)} seconds`);

//         setTimeout(() => {
//           for (const token of patient.deviceTokens) {
//             sendNotification(token, "💊 Medicine Reminder", `It's time to take your medicine: ${medicine.name}`);
//             console.log(`📩 Sent to ${token} at ${new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" })}`);
//           }
//         }, delay);
//       } else {
//         console.log("⏭️ Skipped reminder in the past");
//       }
//     } else {
//       console.log("⚠️ Skipped: Missing deviceToken or reminder time");
//     }
//   }
// };
