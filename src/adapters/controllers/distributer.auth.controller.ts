import { Request, Response, NextFunction } from "express";

// interfaces
import { IDistributerAuthenticationController, IDistributerLoginCredentials, IDistributerRegisterCredentials } from "../../interface/controllers/distributer.IAuth.controller";
import IDistributerAuthUseCase from "../../interface/usecase/distributer.IAuth.usecase";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { IAuthTokens } from "../../interface/utils/IJWTService";

export default class DistributerAuthenticationController implements IDistributerAuthenticationController {
    private distributerAuthUseCase: IDistributerAuthUseCase;

    constructor(distributerAuthUseCase: IDistributerAuthUseCase) {
        this.distributerAuthUseCase = distributerAuthUseCase;
    }

    async googleAuthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const idToken: string | undefined = req.body.token;

            const token: string = await this.distributerAuthUseCase.googleLoginDistributer(idToken);
            
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
            }: IDistributerLoginCredentials = req.body;

            // usecase for authenticateing distributer
            const authTokens: IAuthTokens = await this.distributerAuthUseCase.authenticateDistributer(email, password); // return token or throw an error

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

            res.cookie('distributerEmailToBeVerified', registerData.email); // Set http only cookie for email to verify the otp

            res.status(StatusCodes.Success).json({
                message: "Successfuly register"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const email: string | undefined = req.cookies.distributerEmailToBeVerified;
            const otp: string | undefined = req.body.otp;

            // use case for handling otp verification request
            await this.distributerAuthUseCase.OTPVerification(email, otp);

            res.cookie('distributerEmailToBeVerified', '', { expires: new Date(Date.now()) }); // clearing cookie

            res.status(StatusCodes.Success).json({
                message: "Successfuly account verified"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const email: string | undefined = req.cookies.distributerEmailToBeVerified;

            // use case for handling otp resend request
            await this.distributerAuthUseCase.OTPResend(email);

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

            await this.distributerAuthUseCase.verifyToken(authorizationHeader);

            res.status(StatusCodes.Success).json({
                message: 'Distributer is authenticated'
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
                message: "Distributer Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }
}
