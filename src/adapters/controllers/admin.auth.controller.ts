import { NextFunction, Request, Response } from "express";

// interface
import { IAdminAuthenticationController, IAdminLoginCredentials } from "../../interface/controllers/admin.IAuth.controller";
import IAdminAuthUseCase from "../../interface/usecase/admin.IAuth.usecase";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

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

            const token: string = await this.adminAuthUseCase.authenticateUser(email, password);
            
            res.status(StatusCodes.Success).json({
                message: "Successfuly login",
                token
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
            res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) }); // clearing token stroed http only cookie to logout.
            
            res.status(StatusCodes.Success).json({
                message: "Admin Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }
}