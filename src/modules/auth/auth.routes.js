
import { Router } from "express";
import { addAdmin, signin} from "./auth.controller.js";
import { roleBehavior } from "../../middleware/role.js";



const authRouer = Router()

authRouer.post('/signin', roleBehavior,signin)
authRouer.post('/' , addAdmin)
export default authRouer