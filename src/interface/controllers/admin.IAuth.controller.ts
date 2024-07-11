import { NextFunction, Request, Response } from "express";

export interface IAdminAuthenticationController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
}

export interface IAdminLoginCredentials {
    email: string;
    password: string;
}