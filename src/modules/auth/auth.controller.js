
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Admin } from "../../../databases/models/admin.model.js";




export const addAdmin = catchError(async(req, res, next) => {
   let admin = new Admin(req.body)
    await admin.save()
    res.json({message:"succes"})
});
// export const signin = catchError(async (req, res, next) => {
//     const model = req.info;

//     let user = await model.findOne({ name: req.body.name })
          

//     if (user && bcrypt.compareSync(req.body.password, user.password)) {
              
//         if (req.body.deviceTokens) {
//             user.deviceTokens = req.body.deviceTokens;
//             await user.save();
//         }
 
//           if ((user.role=="patient"||user.role=="doctor") && req.body.deviceToken) {
//             user.deviceTokens = req.body.deviceToken;
//             user.save()
//         }
        
//         let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)


//         return res.json({message:"success" , token})
//     } 

//     next(new AppError("not founded email or password" , 401))
// })
// export const signin = catchError(async (req, res, next) => {
//   const model = req.info;
//   const { name, password, deviceToken, deviceTokens } = req.body;

//   const user = await model.findOne({ name: });
//   if (!user) {
//     return next(new AppError("not founded email or password", 401));
//   }

//   const passwordMatch = bcrypt.compareSync(password, user.password);
//   if (!passwordMatch) {
//     return next(new AppError("not founded email or password", 401));
//   }

//   // ✅ لو فيه توكن جاى من الموبايل، نسجله
//   if (deviceToken || deviceTokens) {
//     user.deviceTokens = deviceToken || deviceTokens;
//     await user.save();
//   }

//   const token = jwt.sign(
//     { userId: user._id, role: user.role },
//     process.env.JWT_KEY
//   );

//   return res.json({ message: "success", token });
// });
// export const signin = catchError(async (req, res, next) => {
//     const model = req.info;

    
//     let user = await model.findOne({ name: req.body.name })
      
//   console.log(bcrypt.compareSync(req.body.password, user.password));
  
//     if (user && bcrypt.compareSync(req.body.password, user.password)) {
        

              
//         if ((user.role=="patient"||user.role=="doctor") && req.body.deviceToken) {
//             user.deviceTokens = req.body.deviceToken;
//             user.save()
//         }

//         let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)


//         return res.json({message:"success" , token})
//     } 

//     next(new AppError("not founded email or password" , 401))
// })
// export const signin = catchError(async (req, res, next) => {
//   const model = req.info;

//   if (!model) {
//     return next(new AppError("Invalid role or missing role", 400));
//   }

//   const { name, password, deviceToken, deviceTokens } = req.body;

//   const user = await model.findOne({ name });
//   if (!user || !bcrypt.compareSync(password, user.password)) {
//     return next(new AppError("not founded email or password", 401));
//   }

//   if (deviceToken || deviceTokens) {
//     user.deviceTokens = deviceToken || deviceTokens;
//     await user.save();
//   }

//   const token = jwt.sign(
//     { userId: user._id, role: user.role },
//     process.env.JWT_KEY
//   );

//   res.json({ message: "success", token });
// });

export const signin = catchError(async (req, res, next) => {
  const model = req.info;  // لازم يتحدد في الـ middleware حسب الـ role

  if (!model) {
    return next(new AppError("Invalid role or missing role", 400));
  }

  const { name, password, deviceToken, deviceTokens } = req.body;

  // دور على المستخدم حسب الاسم فقط
  const user = await model.findOne({ name });

  if (!user) {
    return next(new AppError("not founded email or password", 401));
  }

  // قارن كلمة المرور
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new AppError("not founded email or password", 401));
  }

  // حدث التوكن إذا كان موجود
  if (deviceToken || deviceTokens) {
    user.deviceTokens = deviceToken || deviceTokens;
    await user.save();
  }

  // عمل توكن جديد
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );

  res.json({ message: "success", token });
});


export const protectedRoutes = catchError(async (req, res, next) => {
  let token = req.headers.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("token not founded", 401));


  let userPayload;



  try {
    userPayload = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return next(new AppError("invalid token", 401));
  }

  // ✅ نحط بيانات المستخدم في req.user
  req.user = userPayload;

  next();
});

export const allowedTo = (...roles)=> {
    return catchError(async (req, res, next) => {
        if (roles.includes(req.user.role))
        {
             return next()
             
        }
       return next(new AppError("not authorized to access this end point" , 401))
    })
}

