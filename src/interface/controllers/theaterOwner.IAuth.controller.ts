import { NextFunction, Request, Response } from "express";

export interface ITheaterOwnerAuthenticationController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>
}

export interface ITheaterOwnerLoginCredentials {
    email: string | undefined;
    password: string | undefined;
}

export interface ITheaterOwnerRegisterCredentials {
    name: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
    IDProof: string | undefined;
    IDProofImage: string[] | undefined;
}