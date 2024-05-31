import express, {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();

// connect database
import connectDB from './config/db';
connectDB();

//importing user router
import authRouter from './router/auth.router';

const PORT = process.env.PORT || 3000;

const app: Express = express();

// for parseing json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', authRouter);

app.listen(PORT, () => console.log(`Server is alive at PORT ${PORT}`)); 