import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  reminderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reminder",
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
 status: {
  type: String,
  enum: ["pending", "taken", "skipped"], // ✅ ضيف "taken" و "skipped" هنا
  default: "pending"
},
    resent: {
    type: Boolean,
    default: false
  },
  respondedAt: {
    type: Date,
    default: Date.now
  }
});

export const Response = mongoose.model("Response", responseSchema);
