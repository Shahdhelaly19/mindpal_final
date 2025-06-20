// import { AppError } from "../utils/appError.js"




// export function catchError(callback) {
//     return (req, res, next) => {
//         callback(req, res, next).catch(err => {
//              next(new AppError('error' , 401))
//         })
//     }
// }
import { AppError } from "../utils/appError.js";

export function catchError(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(err => {
            console.error("❌ Caught Error:", err); // ده هيطبع الخطأ الحقيقي في الكونسول
            // لو الخطأ أصلاً من نوع AppError فابعتِه زي ما هو
            if (err instanceof AppError) {
                return next(err);
            }

            // لو مش AppError، ابعتيه كـ 500 Internal Server Error برسالة واضحة
            next(new AppError(err.message || "Internal Error", err.statusCode || 500));
        });
    };
}
