import { Router } from "express";
import { addMedicine, deleteMedicine, updateMedicine,getMedicinesByPatient } from "./medicine.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { canAccessMedData } from "../../middleware/canAccesMed.js";







const medicineRoute = Router()




medicineRoute.post('/', protectedRoutes, allowedTo('admin')
    , addMedicine)
 
medicineRoute.put('/:id', protectedRoutes, allowedTo('doctor','admin'),
    canAccessMedData, updateMedicine)
   

medicineRoute.delete('/:id', protectedRoutes, allowedTo('doctor' , 'admin'),
    canAccessMedData,deleteMedicine)

medicineRoute.get('/patient/:patientId',protectedRoutes,allowedTo('admin', 'doctor'),
  getMedicinesByPatient
);


export default medicineRoute