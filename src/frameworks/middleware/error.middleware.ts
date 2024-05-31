import { NextFunction, Request, Response } from "express";
import AuthenticationError, { ErrorDetails } from "../../errors/authentication.error";

export default function errorHandler(err: ErrorDetails, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AuthenticationError) {
        
        res.status(err.details.statusCode!).json({message: err.message, errorField: err.details.errorField})
    }else{
        console.error(err); // Log entire error object
        res.status(500).json({ error: 'Internal Server Error' });
    }
}