// interfaces
import IDistributerAuthUseCase from "../interface/usecase/distributer.IAuth.usecase";
import IDistributerAuthRepository from "../interface/repositories/distributer.IAuth.repository";
import IHashingService from "../interface/utils/IHashingService";
import IOTPService from "../interface/utils/IOTPService";
import IEmailService from "../interface/utils/IEmailService";
import IJWTService, { IAuthTokens, IPayload } from "../interface/utils/IJWTService";
import { IDistributerRegisterCredentials } from "../interface/controllers/distributer.IAuth.controller";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import { IOTPDocument } from "../interface/collections/IOTP.collections";
import IOTPRepository from "../interface/repositories/OTP.IOTPRepository.interface";
import { IGoogleAuthService } from "../interface/utils/IGoogleAuthService";
import { TokenPayload } from "google-auth-library";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import JWTTokenError from "../errors/jwt.error";
import { IDistributer } from "../entity/distributer.entity";
import IImage from "../interface/common/IImage.interface";
import { isObjectIdOrHexString } from "mongoose";

export default class DistributerAuthUseCase implements IDistributerAuthUseCase {
    private distributerAuthRepository: IDistributerAuthRepository;
    private otpRepository: IOTPRepository;
    private hashingService: IHashingService;
    private otpService: IOTPService;
    private emailService: IEmailService;
    private jwtService: IJWTService;
    private googleAuthService: IGoogleAuthService;

    constructor(distributerAuthRepository: IDistributerAuthRepository, otpRepository: IOTPRepository, hashingService: IHashingService, otpService: IOTPService, emailService: IEmailService, jwtService: IJWTService, private cloudinaryService: ICloudinaryService, googleAuthService: IGoogleAuthService) {
        this.distributerAuthRepository = distributerAuthRepository;
        this.otpRepository = otpRepository;
        this.hashingService = hashingService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.googleAuthService = googleAuthService;
    }

    async googleLoginDistributer(idToken: string | undefined): Promise<string | never> {
        try {
            if(!idToken) {
                throw new RequiredCredentialsNotGiven('GOOGLE_TOKEN_REQUIRE.');
            }

            const decodedToken: TokenPayload | undefined = await this.googleAuthService.verifyIdToken(idToken);

            if(!decodedToken?.email) {
                throw new RequiredCredentialsNotGiven('TOKEN_ERROR_LOGIN_AGAIN.');
            }

            const distributerData: IDistributer | null = await this.distributerAuthRepository.getDataByEmail(decodedToken.email);

            if(!distributerData) {
                throw new RequiredCredentialsNotGiven('No distributer with that email, Create account now.');
            }

            if(!distributerData.OTPVerificationStatus) {
                // if he or she is not verified then make them verified since they log in with google so it's their account so can be verified

                await this.distributerAuthRepository.makeDistributerVerified(distributerData.email);
            }else if(distributerData.documentVerificationStatus === "Pending") {
                throw new AuthenticationError({message: 'document verification is still in process.', statusCode: StatusCodes.Unauthorized, errorField: "document"});
            }else if(distributerData.isBlocked) {
                throw new AuthenticationError({message: 'Account is blocked.', statusCode: StatusCodes.Unauthorized, errorField: "blocked"});
            }
            
            const payload: IPayload = {
                id: distributerData._id,
                type: 'Distributer'
            }

            const token: string = this.jwtService.sign(payload, "15m");

            return token;
        } catch (err: any) {
            throw err;
        }
    }

    async authenticateDistributer(email: string | undefined, password: string | undefined): Promise<IAuthTokens | never> {
     try {
        if(!email || !password) {
            throw new AuthenticationError({message: 'Provide All required fields.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
        }

        const distributerData: IDistributer | null = await this.distributerAuthRepository.getDataByEmail(email);

        if(!distributerData) {
            throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
        }else if(!await this.hashingService.compare(password, distributerData.password)) {
            throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
        }else if(!distributerData.OTPVerificationStatus) {
            await this.generateAndSendOTP(distributerData.email); // send otp via email.

            throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOTPVerifiedErrorEmail: distributerData.email, cookieKeyForOTPVerification: 'distributerEmailToBeVerified'});
        }else if(distributerData.documentVerificationStatus === "Pending") {
            throw new AuthenticationError({message: 'document verification is still in process.', statusCode: StatusCodes.Unauthorized, errorField: "document"});
        }else if(distributerData.isBlocked) {
            throw new AuthenticationError({message: 'Account is blocked.', statusCode: StatusCodes.Unauthorized, errorField: "blocked"});
        }

        const payload: IPayload = {
            id: distributerData._id,
            type: 'Distributer'
        }
        
        const accessToken: string = this.jwtService.sign(payload, "15m");

        const refreshToken: string = this.jwtService.sign(payload, "30d");

        const authTokens: IAuthTokens = {
            accessToken,
            refreshToken
        }

        return authTokens;
     } catch (err: any) {
        throw err;
     }   
    }

    async register(registerData: IDistributerRegisterCredentials): Promise<void | never> {
        try {
            if(!registerData.name || !registerData.email || !registerData.phoneNumber || !registerData.password || !registerData.confirmPassword || !registerData.IDProof || !registerData.IDProofImage || !registerData.licence || !(/^[A-Za-z0-9]+@gmail\.com$/).test(registerData.email) || (registerData.phoneNumber.length !== 10) || (registerData.password !== registerData.confirmPassword) || (registerData.IDProofImage.length !== 2)) {
                throw new AuthenticationError({message: 'Provide all required details correctly.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
            }

            const isEmailTaken: IDistributer | null = await this.distributerAuthRepository.getDataByEmail(registerData.email);
            const isPhoneNumberTaken: IDistributer | null = await this.distributerAuthRepository.getDataByPhoneNumber(registerData.phoneNumber);

            if(isEmailTaken) {
                throw new AuthenticationError({message: 'The email address you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'email'});
            }else if(isPhoneNumberTaken) {
                throw new AuthenticationError({message: 'The PhoneNumber you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'phoneNumber'});
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);

            registerData.password = hashedPassword;

            const secureUrlIDProofImage: IImage[] = [];

            for(const imageDataBase64 of registerData.IDProofImage) {
                const secure_url = await this.cloudinaryService.uploadImage(imageDataBase64 as string); // returns secure url
                secureUrlIDProofImage.push(secure_url);
            }

            registerData.IDProofImage = secureUrlIDProofImage; // change property value to array of secure url of the uploaded image to store it in database to see images

            const secure_url = await this.cloudinaryService.uploadImage(registerData.licence as string); // returns secure url
            registerData.licence = secure_url;

            await this.distributerAuthRepository.createDistributer(registerData);

            await this.generateAndSendOTP(registerData.email); // generate and send otp using email services
        } catch (err: any) {
            throw err;
        }
    }

    async OTPVerification(email: string | undefined, otp: string | undefined): Promise<void | never> {
        try {
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email'});
            }else if(!otp || (otp.length !== 6)) {
                throw new AuthenticationError({message: 'Provide all required details correctly.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
            }

            const otpData: IOTPDocument | null = await this.otpRepository.getOTPByEmail(email);

            if(!otpData) {
                throw new AuthenticationError({message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }else if(otpData.otp !== otp) {
                throw new AuthenticationError({message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }

            await this.otpRepository.deleteOTPByEmail(email); // delete otp document used for verification
            
            await this.distributerAuthRepository.makeDistributerVerified(email);
        } catch (err: any) {
            throw err;
        }
    }

    async OTPResend(email: string | undefined): Promise<void | never> {
        try {
            if(!email) {
                throw new AuthenticationError({message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email'});
            }

            this.generateAndSendOTP(email); // send otp via email using email service made a common service.
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

    async verifyToken(authorizationHeader: string | undefined): Promise<void | never> {
        try {
            if(!authorizationHeader) {
                throw new JWTTokenError({ tokenName: "Token", statusCode: StatusCodes.Unauthorized, message: 'Distributer not authenticated' })
            }

            const token = authorizationHeader.split(' ')[1];

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== 'Distributer') {
                throw new JWTTokenError({ tokenName: "Token", statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }
        } catch (err: any) {
            throw err;
        }
    }
}