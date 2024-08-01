import { Request, Response, NextFunction } from "express";

// interfaces
import { ITheaterOwnerAuthenticationController, ITheaterOwnerLoginCredentials, ITheaterOwnerRegisterCredentials } from "../../interface/controllers/theaterOwner.IAuth.controller";
import ITheaterOwnerAuthUseCase from "../../interface/usecase/theaterOwner.IAuth.usecase";

//enums
import { StatusCodes } from "../../enums/statusCode.enum";

export default class TheaterOwnerAuthenticationController implements ITheaterOwnerAuthenticationController {
    private theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase;

    constructor(theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase) {
        this.theaterOwnerAuthUseCase = theaterOwnerAuthUseCase;
    }

    async googleAuthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const idToken: string | undefined = req.body.token;

            const token: string = await this.theaterOwnerAuthUseCase.googleLoginUser(idToken);

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token
            
            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
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
            const token: string = await this.theaterOwnerAuthUseCase.authenticateUser(email, password); // return token or throw an error

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

            res.cookie('theaterOwnerEmailToBeVerified', registerData.email); // Set http only cookie for user email to verify the otp

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

            res.cookie('theaterOwnerEmailToBeVerified', '', { expires: new Date(Date.now()) }); // clearing cookie

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
            const token: string | undefined = req.cookies.token;

            await this.theaterOwnerAuthUseCase.verifyToken(token);

            res.status(StatusCodes.Success).json({
                message: 'Theater Owner is authenticated'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) }); // clearing token stroed http only cookie to logout.
            
            res.status(StatusCodes.Success).json({
                message: "Theater Owner Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }
}