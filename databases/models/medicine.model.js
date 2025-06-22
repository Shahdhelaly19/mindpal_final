import { model, Schema, Types } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true
  },

  dosage: {
    type: String, // الكمية في كل جرعة (مثلاً 80)
    required: true
  },

  pillsPerDay: {
    type: Number, // عدد المرات في اليوم (مثلاً 2)
    required: true
  },

  timeToTake: {
    type: String, // أول ميعاد بياخد فيه الجرعة بصيغة "HH:mm"
    required: true
  },

  schedule: {
    type: String, // زي "مرتين يوميًا" أو "تلات مرات"
    required: false
  },

  type: {
    type: String, // شكل الدوا زي "tablet", "capsule"
    required: false
  },

  numPottle: {
    type: String, // عدد العلب أو العبوات
    required: false
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  prescribedTo: {
    type: Types.ObjectId,
    ref: 'Patient',
    required: true
  },

  confirm: {
    type: Boolean,
    default: false
  },

  // ✅ المضافة حديثًا:
  intervalDays: {
    type: Number, // كل كام يوم بياخده (1 = يوميًا، 2 = يوم بعد يوم...)
    default: 1
  }
}, { timestamps: true });

export const Medicine = model("Medicine", schema);
