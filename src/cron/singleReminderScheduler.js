// import cron from "node-cron";
// import { sendNotification } from "../utils/sendNotification.js";

// /**
//  * Schedules a single reminder at a given time
//  * @param {Date} time 
//  * @param {string|string[]} tokens 
//  * @param {object} medicineInfo - contains name and dose
//  * @param {string|null} reminderId 
//  */
// export const scheduleSingleReminder = (time, tokens, medicineInfo, reminderId = null) => {
//   let tokenList = [];

//   if (typeof tokens === "string" && tokens.trim() !== "") {
//     tokenList = [tokens];
//   } else if (Array.isArray(tokens) && tokens.length > 0) {
//     tokenList = tokens;
//   } else {
//     console.warn("⚠️ No valid tokens provided for reminder.");
//     return;
//   }

//   const cronTime = `${time.getMinutes()} ${time.getHours()} ${time.getDate()} ${time.getMonth() + 1} *`;

//   console.log("⏰ Scheduled at:", cronTime, "=>", medicineInfo?.name);

//   cron.schedule(
//     cronTime,
//     async () => {
//       console.log("⏰ CRON JOB TRIGGERED");

//       const { name: medicineName, dose } = medicineInfo;
//       const timeString = `${time.getHours()}:${time.getMinutes()}`;
//       const bodyMessage = `📢 It's time to take your ${medicineName}!`;

//       const dataPayload = {
//         medicineName,
//         time: timeString,
//         medicineId: reminderId?.toString() || "",
//         action1: "check",
//         action2: "skip",
//         type: "reminder"
//       };

//       for (const token of tokenList) {
//         try {
//           await sendNotification(token, "💊 Medicine Reminder", bodyMessage, dataPayload, "patient");
//           console.log(`📩 Notification sent to token: ${token} at ${new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" })}`);
//         } catch (err) {
//           console.error("❌ Failed to send notification to token:", token, err);
//         }
//       }
//     },
//     {
//       timezone: "Africa/Cairo",
//     }
//   );
// };
import cron from "node-cron";
import { sendNotification } from "../utils/sendNotification.js";

/**
 * Schedules a single reminder at a given time
 * @param {Date} time 
 * @param {string|string[]} tokens 
 * @param {object} medicineInfo - contains name and dose
 * @param {string|null} reminderId 
 */
export const scheduleSingleReminder = (time, tokens, medicineInfo, reminderId = null) => {
  let tokenList = [];

  if (typeof tokens === "string" && tokens.trim() !== "") {
    tokenList = [tokens];
  } else if (Array.isArray(tokens) && tokens.length > 0) {
    tokenList = tokens;
  } else {
    console.warn("⚠️ No valid tokens provided for reminder.");
    return;
  }

  const cronTime = `${time.getMinutes()} ${time.getHours()} ${time.getDate()} ${time.getMonth() + 1} *`;

  console.log("📅 CRON TIME:", cronTime, `=> Medicine: ${medicineInfo?.name}`);

  cron.schedule(
    cronTime,
    async () => {
      console.log("🚀 CRON TRIGGERED!");

      const { name: medicineName, dose } = medicineInfo;
      const timeString = `${time.getHours()}:${time.getMinutes()}`;
      const bodyMessage = `📢 It's time to take your ${medicineName}!`;

      const dataPayload = {
        medicineName,
        time: timeString,
        medicineId: reminderId?.toString() || "",
        action1: "check",
        action2: "skip",
        type: "reminder"
      };

      for (const token of tokenList) {
        try {
          await sendNotification(token, "💊 Medicine Reminder", bodyMessage, dataPayload, "patient");
          console.log(`📩 Notification sent to token: ${token} at ${new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" })}`);
        } catch (err) {
          console.error("❌ Failed to send notification to token:", token, err);
        }
      }
    },
    {
      timezone: "Africa/Cairo",
    }
  );
};

