import { Doctor } from "../../../databases/models/doctor.models.js";
import { Medicine } from "../../../databases/models/medicine.model.js";
import { Patient } from "../../../databases/models/patient.model.js";
import { Reminder } from "../../../databases/models/reminder.model.js";
import { Scan } from "../../../databases/models/scan.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { sendNotification } from "../../utils/sendNotification.js";




export const getPatient = catchError(async (req, res, next) => {
    
    let patient = await Patient.findById(req.params.id).populate('doctorId','name')
    const scan = await Scan.find({ uploadedTo: patient._id });
    const medicines = await Medicine.find({ prescribedTo: patient._id });

    let final = {
        ...patient.toObject(),
         scan: scan || [],
        medicines: medicines || [],
   }

    return patient ? res.status(200).json({ message: "success", patient: final })
                 : next(new AppError("User not founded", 404))
})


export const getMyPatients = catchError(async (req, res, next) => {
    let filterObj = {};
    filterObj.role = "patient";
      if (req.user.role === "doctor") {
        filterObj.doctorId = req.user.userId;
    }

    
    const patients = await Patient.find(filterObj);

    const patientsWithData = await Promise.all(
        patients.map(async (patient) => {
            const scans = await Scan.find({ uploadedTo: patient._id });

            const medicines = await Medicine.find({ prescribedTo: patient._id });

            // لكل دواء، جبلي reminders الخاصة به
            const medicinesWithReminders = await Promise.all(
                medicines.map(async (medicine) => {
                    const reminders = await Reminder.find({ medicineId: medicine._id });
                    return {
                        ...medicine.toObject(),
                        reminders: reminders || [],
                    };
                })
            );

            return {
                ...patient.toObject(),
                scan: scans || [],
                medicines: medicinesWithReminders,
            };
        })
    );

    res.status(200).json({ message: "success", patients: patientsWithData });
});


export const addPatient = catchError(async (req, res, next) => {
  console.log("🚀 Entered addPatient API"); // ✅ هنا أول سطر نتأكد إن الدالة اشتغلت

  const doctor = await Doctor.findOne({ code: req.body.code, role: "doctor" });

  if (!doctor) {
    return next(new AppError("Doctor code not found", 409));
  }

  console.log("🟢 Step 2: Doctor deviceToken is:", doctor.deviceTokens); // ✅ نتأكد الدكتور عنده توكن ولا لأ

  const { name, password, age, deviceTokens  } = req.body;

  const newPatient = new Patient({
    name,
    password,
    age,
    doctorId: doctor._id,
    deviceTokens
  });

  await newPatient.save();

  if (doctor.deviceTokens) {
    console.log("📬 Sending notification to doctor:", doctor.name);

    await sendNotification(
      doctor.deviceTokens,
      "👨‍⚕️ Doctor Alert",
      `New patient (${newPatient.name}) added under your care. Please follow up.`,
      {
        type: "doctor_alert",
        patientId: newPatient._id.toString(),
      },
      "doctor"
    );
  }

  res.status(201).json({
    message: "Patient created successfully",
    patient: newPatient,
  });
});






export const updatePatientByDoctor = catchError(async (req, res, next) => {


    if (req.body.code) {
    let doctor = await Patient.findOne({ code: req.body.code , role:"doctor" })
    if (!doctor)
         return next(new AppError("code not found", 409))
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    );

    res.status(200).json({
        message: "Patient updated successfully",
        patient: updatedPatient
    });
});





