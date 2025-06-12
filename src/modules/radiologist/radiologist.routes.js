import { Router } from "express";
import { addRadiologist,  RadiologistSignin } from "./radiologist.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";





const radiologistRouter = Router();

radiologistRouter.post('/signin',RadiologistSignin)
radiologistRouter.post('/', protectedRoutes, allowedTo('admin'),addRadiologist)


export default radiologistRouter