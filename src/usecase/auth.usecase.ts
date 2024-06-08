import { StatusCodes } from "../enums/statusCode.enum";
import AuthenticationError from "../errors/authentication.error";
import { IOTPDocument } from "../interface/collections/IOTP.collections";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import { IRegisterCredentials } from "../interface/controllers/IAuth.controller";
import IAuthRepository from "../interface/repositories/IAuth.repositories";
import IAuthUseCase from "../interface/usecase/IAuth.usecase";
import IEmailService from "../interface/utils/IEmailService";
import IHashingService from "../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";
import IOTPService from "../interface/utils/IOTPService";

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
                throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp"});
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
                throw new AuthenticationError({message: 'The email address you entered is already registered. Try a different email.', statusCode: StatusCodes.BadRequest, errorField: 'email'});
            }else if(isPhoneNumberTaken) {
                throw new AuthenticationError({message: 'The PhoneNumber you entered is already registered. Try a different PhoneNumber.', statusCode: StatusCodes.BadRequest, errorField: 'phoneNumber'});
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);

            registerData.password = hashedPassword;

            await this.authRepository.createUser(registerData);

            const otp: string = this.otpService.generateOTP();

            const to: string = registerData.email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            await this.authRepository.createOTP(registerData.email, otp); // saving otp in database
        } catch (err: any) {
            throw err;
        }
    }

    async OTPVerification(email: string | undefined, otp: string): Promise<void> {
        try {
            const otpData: IOTPDocument | null = await this.authRepository.getOTPByEmail(email);
            
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'otp'});
            } else if(!otpData) {
                throw new AuthenticationError({message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            } else if(otpData.otp !== otp) {
                throw new AuthenticationError({message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }

            await this.authRepository.makeUserVerified(email);
        } catch (err: any) {
            throw err;
        }
    }
}