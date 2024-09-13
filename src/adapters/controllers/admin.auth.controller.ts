import { NextFunction, Request, Response } from "express";

// interface
import { IAdminAuthenticationController, IAdminLoginCredentials } from "../../interface/controllers/admin.IAuth.controller";
import IAdminAuthUseCase from "../../interface/usecase/admin.IAuth.usecase";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { IAuthTokens } from "../../interface/utils/IJWTService";

export default class AdminAuthenticationController implements IAdminAuthenticationController {
    private adminAuthUseCase: IAdminAuthUseCase; 

    constructor(adminAuthUseCase: IAdminAuthUseCase) {
        this.adminAuthUseCase = adminAuthUseCase;
    }

    async handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const {
                email,
                password
            }: IAdminLoginCredentials = req.body;

            const authTokens: IAuthTokens = await this.adminAuthUseCase.authenticateUser(email, password);
            
            res.cookie('refreshToken', authTokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60,
            });

            res.status(StatusCodes.Success).json({
                message: "Successfuly login",
                token: authTokens.accessToken
            });
        } catch (err: any) {
            next(err);
        }
    }

    async verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const authorizationHeader: string | undefined = req.headers.authorization;

            await this.adminAuthUseCase.verifyToken(authorizationHeader);

            res.status(StatusCodes.Success).json({
                message: 'Admin is authenticated'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }); // clearing refreshToken stroed http only cookie to logout.
            
            res.status(StatusCodes.Success).json({
                message: "Admin Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }
}