import { Medicine } from "../../../databases/models/medicine.model.js";
import { Patient } from "../../../databases/models/patient.model.js";
import { Doctor } from "../../../databases/models/doctor.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { sendNotification } from "../../utils/sendNotification.js";
import { createRemindersForMedicine } from "../reminder/reminder.utils.js";
import moment from "moment-timezone";

export const updateMedicine = catchError(async(req , res , next) => {

   const  medicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )

    res.status(200).json({
    message: "Medication updated successfully",
    medication: medicine,
  });
    
})


export const deleteMedicine = catchError(async(req , res , next) => {
 
    const medicine = await Medicine.findByIdAndUpdate(req.params.id ,{confirm:false})
    res.status(200).json({
    message: "Medication deleted successfully",
  });
    
})



export const addMedicine = catchError(async (req, res, next) => {
  // ✅ 1. التأكد من المريض
  let patient = await Patient.findOne({ code: req.body.code });
  if (!patient || patient.role !== "patient") {
    return next(new AppError("Patient code is required", 400));
  }

  // ✅ 2. استخراج بيانات الدواء من الـ body
  const {
    name,
    dosage,
    pillsPerDay,
    timeToTake,
    schedule,
    type,
    numPottle,
    startDate,
    endDate,
    intervalDays,
  } = req.body;

  // ✅ 3. إنشاء الدواء
  const newMed = await Medicine.create({
    name,
    dosage,
    pillsPerDay,
    timeToTake,
    schedule,
    type,
    numPottle,
    startDate,
    endDate,
    intervalDays,
    prescribedTo: patient._id
  });

  // ✅ 4. إرسال إشعار للدكتور لو موجود
  const doctor = await Doctor.findById(patient.doctorId);
  if (doctor?.deviceTokens) {
    await sendNotification(
      doctor.deviceTokens,
      "💊 New Prescription Added",
      `A new medicine (${newMed.name}) was prescribed to patient (${patient.name}).`
    );
  }

  // ✅ 5. توليد الريمايندرات تلقائيًا
  const createdReminders = await createRemindersForMedicine(newMed, patient, req.user?.userId);

  // ✅ 6. تنسيق الأوقات لتوقيت القاهرة
  const formattedReminders = createdReminders.map(rem => ({
    _id: rem._id,
    patientId: rem.patientId,
    medicineId: rem.medicineId,
    time: moment(rem.time).tz("Africa/Cairo").format("YYYY-MM-DD HH:mm"),
    createdBy: rem.createdBy,
  }));

  // ✅ 7. الرد بالنتيجة
  res.status(201).json({
    message: `✅ Medication added successfully with ${createdReminders.length} reminder(s) generated.`,
    medication: newMed,
    reminderCount: createdReminders.length,
    reminders: formattedReminders
  });
});

export const getMedicinesByPatient = catchError(async (req, res, next) => {
  const { patientId } = req.params;

  const medicines = await Medicine.find({ prescribedTo: patientId });

  res.status(200).json({
    message: "✅ Medicines for patient retrieved successfully",
    medicines,
  });
});