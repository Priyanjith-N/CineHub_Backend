import { NextFunction, Request, Response } from "express";

// interfaces
import { IUserAuthenticationController, IUserLoginCredentials, IUserRegisterCredentials} from "../../interface/controllers/user.IAuth.controller";
import IUserAuthUseCase from "../../interface/usecase/user.IAuth.usecase";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

export default class UserAuthenticationController implements IUserAuthenticationController {
    private userAuthUseCase: IUserAuthUseCase;
    
    constructor(userAuthUseCase: IUserAuthUseCase) {
        this.userAuthUseCase = userAuthUseCase;
    }

    async googleAuthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const idToken: string | undefined = req.body.token;

            const token: string = await this.userAuthUseCase.googleLoginUser(idToken);
            
            res.status(StatusCodes.Success).json({
                message: "Successfuly login",
                token
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const {
                email,
                password
            }: IUserLoginCredentials = req.body;
            
            // usecase for authenticateing User
            const token: string = await this.userAuthUseCase.authenticateUser(email, password); // return token if credentials and user is verified or error
            
            res.status(StatusCodes.Success).json({
                message: "Successfuly login",
                token
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleRegisterRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const {
                name,
                phoneNumber,
                email,
                password,
                confirmPassword
            }: IUserRegisterCredentials = req.body;

            const registerData: IUserRegisterCredentials = {
                name,
                phoneNumber,
                email,
                password,
                confirmPassword
            };

            await this.userAuthUseCase.userRegister(registerData);

            res.cookie('emailToBeVerified', registerData.email); // Set http only cookie for user email to verify the otp

            res.status(StatusCodes.Success).json({
                message: "Successfuly register"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;
            const otp: string = req.body.otp;
            
            
            const token: string = await this.userAuthUseCase.OTPVerification(emailToBeVerified, otp);

            res.cookie('emailToBeVerified', '', { expires: new Date(Date.now()) }); // clearing cookie

            res.status(StatusCodes.Success).json({
                message: "Successfuly account verified",
                token
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;

            await this.userAuthUseCase.OTPResend(emailToBeVerified);

            res.status(StatusCodes.Success).json({
                message: 'OTP Resend Successfull'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const authorizationHeader: string | undefined = req.headers.authorization;

            await this.userAuthUseCase.verifyToken(authorizationHeader);

            res.status(StatusCodes.Success).json({
                message: 'User is authenticated'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) }); // clearing token stroed http only cookie to logout.
            
            res.status(StatusCodes.Success).json({
                message: "User Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }
}