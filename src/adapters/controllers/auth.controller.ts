import { NextFunction, Request, Response } from "express";
import { IAuthController, ILoginCredentials} from "../../interface/controllers/IAuth.controller";
import IAuthUseCase from "../../interface/usecase/IAuth.usecase";

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
            
            // usecase for authenticateing User
            await this.authUseCase.authenticateUser(email, password);
            
            res.status(200).json({
                messsage: "Successfuly login",
                token: "1234567890.qwertyuiop.lkjhgfdsa"
            });
        } catch (err: any) {
            next(err);
        }
    }
}