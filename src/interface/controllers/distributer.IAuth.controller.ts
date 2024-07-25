import { NextFunction, Request, Response } from "express";

export interface IDistributerAuthenticationController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
}

export interface IDistributerLoginCredentials {
    email: string | undefined;
    password: string | undefined;
}

export interface IDistributerRegisterCredentials {
    name: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
    IDProof: string | undefined;
    IDProofImage: string[] | undefined;
    licence: string | undefined;
}