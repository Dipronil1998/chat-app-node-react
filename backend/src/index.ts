import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectToMongoDB from './db/connectToMongoDB';
import { pageNotFound } from './utils/pageNotFound';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/auth.routes'
import messageRoutes from './routes/message.routes'
import userRoutes from './routes/user.routes'
const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json());
dotenv.config()
const port = process.env.PORT || 3000;
app.use(cookieParser());

app.get('/', (req:Request, res:Response)=>{
  res.send('index')
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use(pageNotFound);
app.use(errorHandler);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running at http://localhost:${port}`);
});
