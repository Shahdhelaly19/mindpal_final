// src/modules/reminder/reminder.routes.js

import { Router } from "express";
import { addReminder,getRemindersByMedicine } from "./reminder.controller.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";

const router = Router();

router.post("/", protectedRoutes, allowedTo("admin"), addReminder);

router.get('/medicine/:medicineId',protectedRoutes,allowedTo('admin', 'doctor' ,'patient'),
  getRemindersByMedicine
);


export default router;
