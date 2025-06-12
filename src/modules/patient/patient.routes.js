import { Router } from "express";
import {addPatient, getMyPatients, getPatient, updatePatientByDoctor } from "./patient.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { canAccessPatientData } from "../../middleware/canAccessPatientData.js";




const patientRouter = Router()

patientRouter.get('/:id'
    ,protectedRoutes, allowedTo('doctor','admin')
    ,canAccessPatientData, getPatient)

patientRouter.get('/',protectedRoutes,
    allowedTo('admin','doctor'),getMyPatients)

patientRouter.post('/', protectedRoutes, allowedTo('admin'),addPatient)

patientRouter.put('/:id', protectedRoutes,
    allowedTo('doctor'),canAccessPatientData, updatePatientByDoctor)


    



    
export default patientRouter