import { NextFunction, Request, Response } from "express";
import IRefreshTokenAuthUseCase from "../../interface/usecase/IRefreshToken.IAuth.usecase";
import { StatusCodes } from "../../enums/statusCode.enum";
import IRefreshTokenAuthController from "../../interface/controllers/refreshToken.IAuth.controller";

export default class RefreshTokenAuthController implements IRefreshTokenAuthController {
    private refreshTokenAuthUseCase: IRefreshTokenAuthUseCase;

    constructor(refreshTokenAuthUseCase: IRefreshTokenAuthUseCase) {
        this.refreshTokenAuthUseCase = refreshTokenAuthUseCase;
    }

    async getNewAccessTokenWithRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const refreshToken: string | undefined = req.cookies.refreshToken;

            const accessToken: string = await this.refreshTokenAuthUseCase.getNewAccessTokenWithRefreshToken(refreshToken);

            res.status(StatusCodes.Success).json({
                message: "New acess token created",
                token: accessToken
            });
        } catch (err: any) {
            next(err);
        }
    }
}