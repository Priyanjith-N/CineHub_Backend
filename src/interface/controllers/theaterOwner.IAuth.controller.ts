import { NextFunction, Request, Response } from "express";

export interface ITheaterOwnerAuthenticationController {
    handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
}

export interface ITheaterOwnerLoginCredentials {
    email: string | undefined;
    password: string | undefined;
}