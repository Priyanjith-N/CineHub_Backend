import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
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