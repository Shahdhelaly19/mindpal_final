import { Reminder } from "../../../databases/models/reminder.model.js";
import moment from "moment-timezone";

/**
 * Generate reminders for a medicine
 * @param {Object} medicine - The medicine document
 * @param {Object} patient - The patient document
 * @param {string} createdBy - The user ID who created the medicine (admin/doctor)
 * @returns {Promise<Array>} created reminders
 */
export const createRemindersForMedicine = async (medicine, patient, createdBy) => {
  const reminders = [];

  const {
    _id: medicineId,
    pillsPerDay,
    timeToTake,
    hoursApart,
    intervalDays,
    startDate,
    endDate
  } = medicine;

  const start = moment(startDate).startOf('day');
  const end = moment(endDate).endOf('day');

  // تحويل timeToTake (مثلاً "14:00") إلى ساعة ودقيقة
  const [startHour, startMinute] = timeToTake.split(":").map(Number);

  // نبدأ من startDate ونتقدم كل intervalDays
  for (let date = start.clone(); date.isSameOrBefore(end); date.add(intervalDays || 1, "days")) {
    // لكل يوم، نحسب مواعيد الجرعات
    for (let i = 0; i < (pillsPerDay || 1); i++) {
      const reminderTime = date.clone().hour(startHour).minute(startMinute).add(i * (hoursApart || 6), "hours");

      // لو الموعد داخل الفترة بين start و end
      if (reminderTime.isBetween(start, end, null, '[]')) {
        reminders.push({
          patientId: patient._id,
          medicineId,
          time: reminderTime.toDate(),
          createdBy
        });
      }
    }
  }

  // حفظ الريمايندرات في الداتا بيز
  const created = await Reminder.insertMany(reminders);
  return created;
};
