import { Router } from "express";
import { addAdmin, signin} from "./auth.controller.js";
import { roleBehavior } from "../../middleware/role.js";

const authRouter = Router();

authRouter.post('/signin', roleBehavior, signin);
authRouter.post('/', addAdmin);


export default authRouter;
