import multer from "multer"
import { AppError } from "../utils/appError.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloud.js";

const fileUpload = (folderName) => {
  
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "aiPhoto", // اسم المجلد على Cloudinary
      allowed_formats: ["png","jpg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });



function fileFilter (req, file, cb) {

  if(file.mimetype.startsWith('image'))
    cb(null, true)
  else
   cb(new AppError('images only' , 401) , false)

}

const upload = multer({
    storage, fileFilter
})
    
    return upload;
}


export const uploadSingleFile = (fileName) => {
     return fileUpload().single(fileName)
}

