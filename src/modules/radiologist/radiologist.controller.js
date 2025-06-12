
import { catchError } from "../../middleware/catchError.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../../utils/appError.js";
import { Radiologist } from "../../../databases/models/radio.models.js";




export const RadiologistSignin = catchError(async (req, res, next) => {

    let user = await Radiologist.findOne({name:req.body.name})
   
    if (user && bcrypt.compareSync(req.body.password,user.password)) {
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
        return res.json({ message: "success", token })
    }
    next(new AppError("not founded email or password", 401))
})

export const addRadiologist = catchError(async (req, res, next) => {
    const { name, password } = req.body;
    let radiolo = new Radiologist({
        name,
        password
    })

    await radiolo.save()

    res.status(201).json({ message: "Radiologist created successfully", radiolo });
})



