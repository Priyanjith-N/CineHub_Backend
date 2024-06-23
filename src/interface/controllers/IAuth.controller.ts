import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
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