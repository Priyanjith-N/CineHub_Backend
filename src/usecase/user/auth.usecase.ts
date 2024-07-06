import { StatusCodes } from "../../enums/statusCode.enum";
import AuthenticationError from "../../errors/authentication.error";
import JWTTokenError from "../../errors/jwt.error";
import { IOTPDocument } from "../../interface/collections/IOTP.collections";
import { IUserDocument } from "../../interface/collections/IUsers.collections";
import { IRegisterCredentials } from "../../interface/controllers/user/IAuth.controller";
import IAuthRepository from "../../interface/repositories/user/IAuth.repositories";
import IAuthUseCase from "../../interface/usecase/user/IAuth.usecase";
import IEmailService from "../../interface/utils/IEmailService";
import IHashingService from "../../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";
import IOTPService from "../../interface/utils/IOTPService";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    private hashingService: IHashingService;
    private jwtService: IJWTService;
    private emailService: IEmailService;
    private otpService: IOTPService;
    constructor(authRepository: IAuthRepository, hashingService: IHashingService, jwtService: IJWTService, emailService: IEmailService, otpService: IOTPService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    async authenticateUser(email: string, password: string): Promise<string> {
        try {
            const userData: IUserDocument | null = await this.authRepository.getDataByEmail(email);

            if(!userData) {
                throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
            }else if(!await this.hashingService.compare(password, userData.password as string)) {
                throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
            }else if(!userData.OTPVerification) {
                await this.generateAndSendOTP(userData.email as string); // send otp via email.

                throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOTPVerifiedError: userData.email as string});
            }

            const payload: IPayload = {
                id: userData._id,
                type: 'User'
            }
            const token: string = this.jwtService.sign(payload);

            return token;
        } catch (err: any) {
            throw err;
        }
    }

    async userRegister(registerData: IRegisterCredentials): Promise<void> {
        try {
            const isEmailTaken: IUserDocument | null = await this.authRepository.getDataByEmail(registerData.email); // if there is any user with same email
            const isPhoneNumberTaken: IUserDocument | null = await this.authRepository.getDataByPhoneNumber(registerData.phoneNumber); // if there is any user with same phonenumber

            if(isEmailTaken) {
                throw new AuthenticationError({message: 'The email address you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'email'});
            }else if(isPhoneNumberTaken) {
                throw new AuthenticationError({message: 'The PhoneNumber you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'phoneNumber'});
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);

            registerData.password = hashedPassword;

            await this.authRepository.createUser(registerData);

            await this.generateAndSendOTP(registerData.email); // send otp via email.
        } catch (err: any) {
            throw err;
        }
    }

    async OTPVerification(email: string | undefined, otp: string): Promise<string> {
        try {
            const otpData: IOTPDocument | null = await this.authRepository.getOTPByEmail(email);
            
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email'});
            } else if(!otpData) {
                throw new AuthenticationError({message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            } else if(otpData.otp !== otp) {
                throw new AuthenticationError({message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }

            await this.authRepository.makeUserVerified(email);

            const userData: IUserDocument | null = await this.authRepository.getDataByEmail(email);

            const payload: IPayload = {
                id: userData?.id,
                type: 'User'
            }

            const authToken: string = this.jwtService.sign(payload); // genrateing jwt token.

            return authToken; // for authing user by cookei
        } catch (err: any) {
            throw err;
        }
    }

    async OTPResend(email: string | undefined): Promise<void> {
        try {
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email'});
            }

            await this.generateAndSendOTP(email); // send otp via email.
        } catch (err: any) {
            throw err;
        }
    }

    private async generateAndSendOTP(email: string): Promise<void> {
        try {
            const otp: string = this.otpService.generateOTP();

            const to: string = email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            await this.authRepository.createOTP(email, otp); // saving otp in database
        } catch (err: any) {
            throw err;
        }
    }

    async verifyToken(token: string | undefined): Promise<void> {
        try {
            if(!token) {
                throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: 'User not authenticated' })
            }

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== 'User') {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }
        } catch (err: any) {
            throw err;
        }
    }
}