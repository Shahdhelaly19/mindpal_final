import { model, Schema, Types } from "mongoose";

const medicineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  timeToTake: {
    type: String,
    required: true,
  },
  pillsPerDay: {
    type: Number
  },
  intervalDays: {
    type: Number,
    default: 1,
  },
  numPottle: {
    type: String,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
  prescribedTo: {
    type: Types.ObjectId,
    ref: "Patient",
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// ✅ Virtual field to populate reminders
medicineSchema.virtual("reminders", {
  ref: "Reminder", // اسم الموديل
  foreignField: "medicineId", // في reminder
  localField: "_id", // في medicine
});

export const Medicine = model("Medicine", medicineSchema);
