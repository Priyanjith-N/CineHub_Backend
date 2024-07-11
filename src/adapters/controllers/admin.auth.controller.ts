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

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token
            
            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }
}