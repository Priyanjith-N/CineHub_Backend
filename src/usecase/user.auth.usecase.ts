// interfaces
import IUserAuthUseCase from "../interface/usecase/user.IAuth.usecase";
import IUserAuthRepository from "../interface/repositories/user.IAuth.repositories";
import { IUserRegisterCredentials } from "../interface/controllers/user.IAuth.controller";
import IEmailService from "../interface/utils/IEmailService";
import IHashingService from "../interface/utils/IHashingService";
import IOTPService from "../interface/utils/IOTPService";
import { IOTPDocument } from "../interface/collections/IOTP.collections";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";
import IOTPRepository from "../interface/repositories/OTP.IOTPRepository.interface";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";
import JWTTokenError from "../errors/jwt.error";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import { IGoogleAuthService } from "../interface/utils/IGoogleAuthService";
import { TokenPayload } from "google-auth-library";
import IUser, { IUserProfile } from "../entity/user.entity";

export default class UserAuthUseCase implements IUserAuthUseCase {
    private userAuthRepository: IUserAuthRepository;
    private otpRepository: IOTPRepository;
    private hashingService: IHashingService;
    private jwtService: IJWTService;
    private emailService: IEmailService;
    private otpService: IOTPService;
    private googleAuthService: IGoogleAuthService;
    
    constructor(userAuthRepository: IUserAuthRepository, otpRepository: IOTPRepository, hashingService: IHashingService, jwtService: IJWTService, emailService: IEmailService, otpService: IOTPService, googleAuthService: IGoogleAuthService) {
        this.userAuthRepository = userAuthRepository;
        this.otpRepository = otpRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.otpService = otpService;
        this.googleAuthService = googleAuthService;
    }

    async googleLoginUser(idToken: string | undefined): Promise<string | never> {
        try {
            if(!idToken) {
                throw new RequiredCredentialsNotGiven('GOOGLE_TOKEN_REQUIRE.');
            }

            const decodedToken: TokenPayload | undefined = await this.googleAuthService.verifyIdToken(idToken);

            if(!decodedToken?.email) {
                throw new RequiredCredentialsNotGiven('TOKEN_ERROR_LOGIN_AGAIN.');
            }

            const userData: IUser | null = await this.userAuthRepository.getDataByEmail(decodedToken.email);

            if(!userData) {
                throw new RequiredCredentialsNotGiven('No user with that email, Create account now.');
            }

            if(!userData.OTPVerification) {
                // if he or she is not verified then make them verified since they log in with google so it's their account so can be verified

                await this.userAuthRepository.makeUserVerified(userData.email);
            }else if(userData.isBlocked) {
                throw new AuthenticationError({message: 'Account is blocked.', statusCode: StatusCodes.Unauthorized, errorField: "blocked"});
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

    async authenticateUser(email: string, password: string): Promise<string | never> {
        try {
            const userData: IUser | null = await this.userAuthRepository.getDataByEmail(email);

            if(!userData) {
                throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
            }else if(!await this.hashingService.compare(password, userData.password as string)) {
                throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
            }else if(!userData.OTPVerification) {
                await this.generateAndSendOTP(userData.email as string); // send otp via email.

                throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOTPVerifiedErrorEmail: userData.email as string, cookieKeyForOTPVerification: 'emailToBeVerified'});
            }else if(userData.isBlocked) {
                throw new AuthenticationError({message: 'Account is blocked.', statusCode: StatusCodes.Unauthorized, errorField: "blocked"});
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

    async userRegister(registerData: IUserRegisterCredentials): Promise<void | never> {
        try {
            const isEmailTaken: IUser | null = await this.userAuthRepository.getDataByEmail(registerData.email); // if there is any user with same email
            const isPhoneNumberTaken: IUser | null = await this.userAuthRepository.getDataByPhoneNumber(registerData.phoneNumber); // if there is any user with same phonenumber

            if(isEmailTaken) {
                throw new AuthenticationError({message: 'The email address you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'email'});
            }else if(isPhoneNumberTaken) {
                throw new AuthenticationError({message: 'The PhoneNumber you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'phoneNumber'});
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);

            registerData.password = hashedPassword;

            await this.userAuthRepository.createUser(registerData);

            await this.generateAndSendOTP(registerData.email); // send otp via email.
        } catch (err: any) {
            throw err;
        }
    }

    async OTPVerification(email: string | undefined, otp: string): Promise<string | never> {
        try {
            const otpData: IOTPDocument | null = await this.otpRepository.getOTPByEmail(email as string);
            
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email'});
            } else if(!otpData) {
                throw new AuthenticationError({message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            } else if(otpData.otp !== otp) {
                throw new AuthenticationError({message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }

            await this.otpRepository.deleteOTPByEmail(email); // delete otp document used for verification
            
            await this.userAuthRepository.makeUserVerified(email);

            const userData: IUser | null = await this.userAuthRepository.getDataByEmail(email);

            const payload: IPayload = {
                id: userData?._id!,
                type: 'User'
            }

            const authToken: string = this.jwtService.sign(payload); // genrateing jwt token.

            return authToken; // for authing user by cookei
        } catch (err: any) {
            throw err;
        }
    }

    async OTPResend(email: string | undefined): Promise<void | never> {
        try {
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email'});
            }

            await this.generateAndSendOTP(email); // send otp via email.
        } catch (err: any) {
            throw err;
        }
    }

    private async generateAndSendOTP(email: string): Promise<void | never> {
        try {
            const otp: string = this.otpService.generateOTP();

            const to: string = email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            await this.otpRepository.createOTP(email, otp); // saving otp in database
        } catch (err: any) {
            throw err;
        }
    }

    async verifyToken(authorizationHeader: string | undefined): Promise<IUserProfile | never> {
        try {
            if(!authorizationHeader) {
                throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: 'User not authenticated' })
            }

            const token = authorizationHeader.split(' ')[1];

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== 'User') {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }

            const data: IUserProfile | null = await this.userAuthRepository.getUserProfileData(decoded.id);

            if(!data) {
                throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: 'User not found' })
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }
}