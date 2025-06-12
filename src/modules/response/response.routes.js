// src/modules/response/response.routes.js

import { Router } from "express";
import { giveResponse } from "./response.controller.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";

const router = Router();

router.post("/", protectedRoutes, allowedTo("patient"), giveResponse);

export default router;
