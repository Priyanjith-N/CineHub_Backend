import { NextFunction, Request, Response } from "express";

export interface IDistributerAuthenticationController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
}

export interface IDistributerLoginCredentials {
    email: string | undefined;
    password: string | undefined;
}