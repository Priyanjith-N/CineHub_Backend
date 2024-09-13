import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

// configure .env file
dotenv.config();

// connect database
import connectDB from './config/db';
connectDB();

// importing refresh token router
import refreshTokenAuthRouter from './router/refreshToken.auth.router';


// importing admin router
import adminAuthRouter from './router/admin.auth.router';
import adminRouter from './router/admin.router';

// importing distributer router
import distributerAuthRouter from './router/distributer.auth.router';
import distributerRouter from './router/distributer.router';

// importing theater owner router
import theaterOwnerAuthRouter from './router/theaterOwner.auth.router';
import theaterOwnerRouter from './router/theaterOwner.router';

//importing user router
import userAuthRouter from './router/user.auth.router';
import userRouter from './router/user.router';


// importing error middleware
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
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// refresh token route
app.use('/refresh-token', refreshTokenAuthRouter)

// admin auth routes
app.use('/api/admin', adminAuthRouter);

// distributer auth routes
app.use('/api/distributer', distributerAuthRouter)

// theaterOwner auth routes
app.use('/api/theaterOwner', theaterOwnerAuthRouter);

// user auth routes
app.use('/api/user', userAuthRouter);

// adminRoutes
app.use('/admin', adminRouter);

// distributerRoutes
app.use('/distributer', distributerRouter);

// distributerRoutes
app.use('/theaterOwner', theaterOwnerRouter);

// userRoutes
app.use('/user', userRouter);


// error middleware for handling errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is alive at PORT ${PORT}`));