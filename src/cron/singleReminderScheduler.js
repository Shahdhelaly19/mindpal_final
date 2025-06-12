import cron from "node-cron";
import { sendNotification } from "../utils/sendNotification.js";

/**
 * Schedules a single reminder at a given time
 * @param {Date} time 
 * @param {string} token 
 * @param {string} message 
 */
export const scheduleSingleReminder = (time, token, message) => {
  const cronTime = `${time.getUTCMinutes()} ${time.getUTCHours()} ${time.getUTCDate()} ${time.getUTCMonth() + 1} *`;

  cron.schedule(cronTime, async () => {
    await sendNotification(token, "Medicine Reminder", message);
  }, {
    timezone: "UTC"
  });
};
