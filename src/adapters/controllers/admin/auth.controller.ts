import { NextFunction, Request, Response } from "express";
import { IAuthController, ILoginCredentials } from "../../../interface/controllers/admin/IAuth.controller";
import IAuthUseCase from "../../../interface/usecase/admin/IAuth.usecase";
import { StatusCodes } from "../../../enums/statusCode.enum";

export default class AuthController implements IAuthController {
    private authUseCase: IAuthUseCase; 

    constructor(authUseCase: IAuthUseCase) {
        this.authUseCase = authUseCase;
    }

    async handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                email,
                password
            }: ILoginCredentials = req.body;

            const token: string = await this.authUseCase.authenticateUser(email, password);

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token
            
            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }
}