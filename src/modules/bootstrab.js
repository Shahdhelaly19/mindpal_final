import dotenv from "dotenv";


import authRouter from "./auth/auth.routes.js"
import doctorRouter from "./doctor/doctor.routes.js"
import medicineRoute from "./medicine/medicine.routes.js"
import reminderRoutes from "./reminder/reminder.routes.js";

import patientRouter from "./patient/patient.routes.js"
import radiologistRouter from "./radiologist/radiologist.routes.js"
import scanRouter from "./scan/scan.routes.js"
import responseRoutes from "./response/response.routes.js";



dotenv.config();

export const bootstrap = (app) => {
    app.use('/api/auth', authRouter)
    app.use('/api/patients', patientRouter)
    app.use('/api/doctors', doctorRouter)
    app.use('/api/medicine',medicineRoute)
    app.use('/api/reminder', reminderRoutes);
    app.use('/api/response', responseRoutes);
   
    //web
    app.use('/api/radiologist', radiologistRouter)
    app.use('/api/scan', scanRouter)
    

    
    
}