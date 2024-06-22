import { NextFunction, Request, Response } from "express";
import AuthenticationError, { ErrorDetails } from "../../errors/authentication.error";
import { StatusCodes } from "../../enums/statusCode.enum";
import jwt from 'jsonwebtoken';

export default function errorHandler(err: ErrorDetails, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AuthenticationError) {
        if(err.details.notOTPVerifiedError) {
            res.cookie('emailToBeVerified', err.details.notOTPVerifiedError, { httpOnly: true }); // Set http only cookie for user email to verify the otp
        }
        
        res.status(err.details.statusCode!).json({message: err.message, errorField: err.details.errorField});
    }else if(err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Token expired' });
    }else{
        console.error(err); // Log entire error object
        res.status(StatusCodes.InternalServer).json({ error: 'Internal Server Error.' });
    }
}