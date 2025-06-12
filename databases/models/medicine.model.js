import { model, Schema, Types } from "mongoose";




const schema = new Schema({
     
    
  name: String,
  dosage: String,
  
  schedule: String,
  type: String,
  startDate: Date,
  endDate: Date,
  
  prescribedTo: {
    type: Types.ObjectId,
    ref: 'Patient', // المريض
    required: true
  },
  
  confirm: {
    type: Boolean,
    default : false
  }
  
})


export const Medicine = model('Medicine' , schema) 