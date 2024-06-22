import express, {Express} from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
dotenv.config();

// connect database
import connectDB from './config/db';
connectDB();

//importing user router
import authRouter from './router/auth.router';
import errorHandler from './middleware/error.middleware';

const PORT = process.env.PORT || 3000;

const app: Express = express();

// enable cors for custom origin
app.use(cors({
    origin: ['http://localhost:4200'],
    credentials: true
}));

// log all requests
app.use(morgan('dev'));

//for parseing cookie data
app.use(cookieParser());

// for parseing json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', authRouter);

// error middleware for handling errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is alive at PORT ${PORT}`));