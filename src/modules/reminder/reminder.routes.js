// src/modules/reminder/reminder.routes.js

import { Router } from "express";
import { addReminder } from "./reminder.controller.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";

const router = Router();

router.post("/", protectedRoutes, allowedTo("admin"), addReminder);

export default router;
