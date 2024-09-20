import { Request, Response, NextFunction } from "express";

// interfaces
import { ITheaterOwnerAuthenticationController, ITheaterOwnerLoginCredentials, ITheaterOwnerRegisterCredentials } from "../../interface/controllers/theaterOwner.IAuth.controller";
import ITheaterOwnerAuthUseCase from "../../interface/usecase/theaterOwner.IAuth.usecase";

//enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { IAuthTokens } from "../../interface/utils/IJWTService";

export default class TheaterOwnerAuthenticationController implements ITheaterOwnerAuthenticationController {
    private theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase;

    constructor(theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase) {
        this.theaterOwnerAuthUseCase = theaterOwnerAuthUseCase;
    }

    async googleAuthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const idToken: string | undefined = req.body.token;
            
            const authTokens: IAuthTokens = await this.theaterOwnerAuthUseCase.googleLoginUser(idToken);

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

    async handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const {
                email,
                password
            }: ITheaterOwnerLoginCredentials = req.body;

            // usecase for authenticateing theater owners
            const authTokens: IAuthTokens = await this.theaterOwnerAuthUseCase.authenticateUser(email, password); // return token or throw an error

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
            const { name, email, phoneNumber, password, confirmPassword, IDProof, IDProofImage }: ITheaterOwnerRegisterCredentials = req.body;
            
            const registerData: ITheaterOwnerRegisterCredentials = {
                name,
                email,
                phoneNumber,
                password,
                confirmPassword,
                IDProof,
                IDProofImage
            }

            // use case fo registering theater owner
            await this.theaterOwnerAuthUseCase.register(registerData);
            

            const isProduction: boolean = process.env.NODE_ENV === 'production';

            res.cookie('theaterOwnerEmailToBeVerified', registerData.email, { 
                domain: process.env.COOKIE_DOMAIN,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
                httpOnly: false
            });

            res.status(StatusCodes.Success).json({
                message: "Successfuly register"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const email: string | undefined = req.cookies.theaterOwnerEmailToBeVerified;
            const otp: string | undefined = req.body.otp;

            // use case for handling otp verification request
            await this.theaterOwnerAuthUseCase.OTPVerification(email, otp);

            const isProduction: boolean = process.env.NODE_ENV === 'production';

            res.clearCookie('theaterOwnerEmailToBeVerified', { 
                domain: process.env.COOKIE_DOMAIN,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
                httpOnly: false
            }); // clearing cookie

            res.status(StatusCodes.Success).json({
                message: "Successfuly account verified"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOTPResendRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const email: string | undefined = req.cookies.theaterOwnerEmailToBeVerified;

            // use case for handling otp resend request
            await this.theaterOwnerAuthUseCase.OTPResend(email);

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

            await this.theaterOwnerAuthUseCase.verifyToken(authorizationHeader);

            res.status(StatusCodes.Success).json({
                message: 'Theater Owner is authenticated'
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
                message: "Theater Owner Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }
}