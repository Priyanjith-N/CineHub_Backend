import { NextFunction, Request, Response } from "express";
import { IAuthController, ILoginCredentials} from "../../interface/controllers/IAuth.controller";
import IAuthUseCase from "../../interface/usecase/IAuth.usecase";
import { StatusCodes } from "../../enums/statusCode.enum";

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
            const token: string = await this.authUseCase.authenticateUser(email, password); // return token if credentials and user is verified or error

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token
            
            res.status(StatusCodes.Success).json({
                messsage: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }
}