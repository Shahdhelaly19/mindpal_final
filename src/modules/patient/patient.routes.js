import { Router } from "express";
import {addPatient, getMyPatients, getPatient, updatePatientByDoctor } from "./patient.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { canAccessPatientData } from "../../middleware/canAccessPatientData.js";
import { getFullPatientReport } from "../patient/patient.report.controller.js";
import { getReminderStats } from "./patient.stats.controller.js"; 





const patientRouter = Router()

patientRouter.get('/:id'
    ,protectedRoutes, allowedTo('doctor','admin','patient')
    ,canAccessPatientData, getPatient)

patientRouter.get('/',protectedRoutes,
    allowedTo('admin','doctor'),getMyPatients)

patientRouter.post('/', protectedRoutes, allowedTo('admin'),addPatient)

patientRouter.put('/:id', protectedRoutes,
    allowedTo('doctor'),canAccessPatientData, updatePatientByDoctor)


patientRouter.get("/:id/report", protectedRoutes, 
    allowedTo("doctor", "admin"), getFullPatientReport);


patientRouter.get("/:id/reminder-stats", protectedRoutes,
    allowedTo("doctor", "admin"), canAccessPatientData, getReminderStats);


    



    
export default patientRouter