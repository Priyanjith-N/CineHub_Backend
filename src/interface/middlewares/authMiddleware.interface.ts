import { NextFunction, Request, Response } from "express";

export default interface IAuthMiddleware {
    isAuthenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface AuthRequest extends Request {
    id?: string;
}