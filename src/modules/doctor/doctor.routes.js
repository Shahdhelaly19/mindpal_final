
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import patientRouter from "../patient/patient.routes.js";
import { addDoctor, allDoctors, deleteDoctor } from "./doctor.controller.js";

import { Router } from "express";






const doctorRouter = Router()
doctorRouter.use('/:doctorId/patients',patientRouter)

doctorRouter.route('/')
    .post(
     protectedRoutes,
        allowedTo('admin'), addDoctor)
    
    
       .get(protectedRoutes,
           allowedTo('admin'), allDoctors)
           


doctorRouter.route('/:id').delete(protectedRoutes,
        allowedTo('admin'), deleteDoctor)



             



export default doctorRouter