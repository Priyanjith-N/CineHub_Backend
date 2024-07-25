import { Request, Response, NextFunction } from "express";

// interfaces
import { IDistributerAuthenticationController, IDistributerLoginCredentials, IDistributerRegisterCredentials } from "../../interface/controllers/distributer.IAuth.controller";
import IDistributerAuthUseCase from "../../interface/usecase/distributer.IAuth.usecase";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

export default class DistributerAuthenticationController implements IDistributerAuthenticationController {
    private distributerAuthUseCase: IDistributerAuthUseCase;

    constructor(distributerAuthUseCase: IDistributerAuthUseCase) {
        this.distributerAuthUseCase = distributerAuthUseCase;
    }

    async handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const {
                email,
                password
            }: IDistributerLoginCredentials = req.body;

            // usecase for authenticateing distributer
            const token: string = await this.distributerAuthUseCase.authenticateUser(email, password); // return token or throw an error

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token

            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const { name, email, phoneNumber, password, confirmPassword, IDProof, IDProofImage, licence }: IDistributerRegisterCredentials = req.body;
            
            const registerData: IDistributerRegisterCredentials = {
                name,
                email,
                phoneNumber,
                password,
                confirmPassword,
                IDProof,
                IDProofImage,
                licence
            }

            // use case for handling register request
            await this.distributerAuthUseCase.register(registerData);

            res.cookie('distributerEmailToBeVerified', registerData.email); // Set http only cookie for user email to verify the otp

            res.status(StatusCodes.Success).json({
                message: "Successfuly register"
            });
        } catch (err: any) {
            next(err);
        }
    }
}
