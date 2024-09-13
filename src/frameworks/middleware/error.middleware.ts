import { NextFunction, Request, Response } from "express";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// errors
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
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
    }else if(err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
        res.status(401).json({ errorField: "Token", message: 'Token expired' });
    }else if(err instanceof JWTTokenError){
        if(err.details.tokenName === "RefreshToken" || err.message === "Invaild Token") res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }); // clearing refreshToken stroed http only cookie.

        res.status(err.details.statusCode).json({ errorField: err.details.tokenName, message: err.message });
    }else if(err instanceof RequiredCredentialsNotGiven) {
        res.status(StatusCodes.BadRequest).json({ requiredCredentialsError: true, message: err.message })
    }else{
        // Log entire error object
        console.error(err);
        res.status(StatusCodes.InternalServer).json({ internalServerError: true, message: 'Internal Server Error.' });
    }
}