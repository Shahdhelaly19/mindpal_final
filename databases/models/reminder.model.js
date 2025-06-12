import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
 medicineId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Medicine",
  required: true
},
  time: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
}, { timestamps: true });

export const Reminder = mongoose.model("Reminder", reminderSchema);
