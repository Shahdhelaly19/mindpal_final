import { Reminder } from "../../databases/models/reminder.model.js";
import { Medicine } from "../../databases/models/medicine.model.js";
import { scheduleSingleReminder } from "./singleReminderScheduler.js";
import { Patient } from "../../databases/models/patient.model.js";



export const scheduleReminders = async () => {
  const reminders = await Reminder.find().populate({
    path: 'medicineId',
    model: Medicine,
    populate: {
      path: 'prescribedTo',
      model: Patient
    }
  });

  for (let reminder of reminders) {
    const medicine = reminder.medicineId;
    const patient = medicine.prescribedTo;

    if (patient?.deviceToken && reminder.time) {
      scheduleSingleReminder(
        new Date(reminder.time),
        patient.deviceToken,
        `It's time to take your medicine: ${medicine.name}`
      );
    }
  }
};
