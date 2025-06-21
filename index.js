
import express from 'express'
import dotenv from "dotenv";




dotenv.config();
import { bootstrap } from './src/modules/bootstrab.js'
import { AppError } from './src/utils/appError.js'
import { globalError } from './src/middleware/globalError.js'
import connectDB from "./databases/dbConnection.js";
import { scheduleReminders } from "./src/cron/reminderScheduler.js";
import "./src/cron/skipReminderRescheduler.js";






import cors from "cors"
dotenv.config();

const app = express()
const port = process.env.PORT || 3000

connectDB().then(() => {
  scheduleReminders(); // تشغيل الجدولة بعد الاتصال بقاعدة البيانات
}); // الاتصال بالداتا بيز
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))
bootstrap(app)


app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 409))
})

app.use(globalError)

console.log("Secret Key is:", process.env.JWT_KEY);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))


