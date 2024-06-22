import e, { NextFunction, Request, Response } from "express";
import { IAuthController, ILoginCredentials, IRegisterCredentials} from "../../interface/controllers/IAuth.controller";
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
                message: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                name,
                phoneNumber,
                email,
                password,
                confirmPassword
            }: IRegisterCredentials = req.body;

            const registerData: IRegisterCredentials = {
                name,
                phoneNumber,
                email,
                password,
                confirmPassword
            };

            await this.authUseCase.userRegister(registerData);

            res.cookie('emailToBeVerified', registerData.email, { httpOnly: true }); // Set http only cookie for user email to verify the otp

            res.status(StatusCodes.Success).json({
                message: "Successfuly register"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;
            const otp: string = req.body.otp;
            
            
            const token: string = await this.authUseCase.OTPVerification(emailToBeVerified, otp);

            res.cookie('emailToBeVerified', '', { httpOnly: true, expires: new Date(Date.now()) }); // clearing http only cookie
            res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now()) }); // clearing http only cookie

            res.status(StatusCodes.Success).json({
                message: "Successfuly account verified"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;

            await this.authUseCase.OTPResend(emailToBeVerified);

            res.status(StatusCodes.Success).json({
                message: 'OTP Resend Successfull'
            });
        } catch (err: any) {
            next(err);
        }
    }
}