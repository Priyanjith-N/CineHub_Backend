import { NextFunction, Request, Response } from "express";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// errors
import { TokenExpiredError } from 'jsonwebtoken';
import AuthenticationError from "../../errors/authentication.error";
import JWTTokenError from "../../errors/jwt.error";
import RequiredCredentialsNotGiven from "../../errors/requiredCredentialsNotGiven.error";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AuthenticationError) {
        if(err.details.notOTPVerifiedErrorEmail) {
            // Set http only cookie for user email to verify the otp
            res.cookie(err.details.cookieKeyForOTPVerification!, err.details.notOTPVerifiedErrorEmail);
        }
        
        res.status(err.details.statusCode!).json({message: err.message, errorField: err.details.errorField});
    }else if(err instanceof TokenExpiredError) {
        // clearing http only cookie
        res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) });

        res.status(401).json({ message: 'Token expired' });
    }else if(err instanceof JWTTokenError){
        // clearing http only cookie
        res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) });
        
        res.status(err.details.statusCode).json({ message: err.message });
    }else if(err instanceof RequiredCredentialsNotGiven) {
        res.status(StatusCodes.BadRequest).json({ requiredCredentialsError: true, message: err.message })
    }else{
        // Log entire error object
        console.error(err);
        res.status(StatusCodes.InternalServer).json({ error: 'Internal Server Error.' });
    }
}