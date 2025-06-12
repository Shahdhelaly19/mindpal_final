import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL)

//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    console.log("✅ DB connected successfully...");
  } catch (error) {
    console.error("❌ DB connection error:", error);
    process.exit(1); // Exit the app if DB connection fails
  }
};

export default connectDB;


// export const dbConnection = mongoose.connect("mongodb+srv://Riham:0ahCUTj7HjinJ8wI@cluster0.rs75a.mongodb.net/graduationProject").then(() => {
//       console.log("databaseConnect");
// })


// export const dbConnection = mongoose.connect("mongodb://localhost:27017/AlzahaimerSystem").then(() => {
//       console.log("databaseConnect");
// })
