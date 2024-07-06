import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterCredentials {
    name: string,
    phoneNumber: string,
    email: string,
    password: string,
    confirmPassword: string
}