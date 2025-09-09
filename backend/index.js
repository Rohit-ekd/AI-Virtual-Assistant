import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";




const app = express();
app.use(cors({
  origin: "https://ai-virtual-assistant-frontend-0wlg.onrender.com",
  credentials: true
}));


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser()); 
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);


app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});

