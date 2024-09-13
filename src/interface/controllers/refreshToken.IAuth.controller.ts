import { NextFunction, Request, Response } from "express";

export default interface IRefreshTokenAuthController {
    getNewAccessTokenWithRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void | never>
}