import { model, Schema, Types } from "mongoose";


const schema = new Schema({

    filePath:
    {
        type: String,
        required: false,
        trim: true
    },

    uploadedTo: // patient 
      {
          type: Types.ObjectId,
          ref: 'Patient',
          required: true
      },

      uploadDate:
      {
          type: Date,
          default: Date.now
      },

      analyzed:
      {
          type: Boolean,
          default: false
      },

      analysisResult:
      {
          type: Object,
          required: false
      }
    
},{
    versionKey: false,
    timestamps: {
        updatedAt:false
    }
})


export const Scan = model('Scan' , schema)