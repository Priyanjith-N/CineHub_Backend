// interfaces
import IDistributerAuthUseCase from "../interface/usecase/distributer.IAuth.usecase";
import IDistributerAuthRepository from "../interface/repositories/distributer.IAuth.repository";
import { IDistributerDocument } from "../interface/collections/IDistributer.collection";
import IHashingService from "../interface/utils/IHashingService";
import IOTPService from "../interface/utils/IOTPService";
import IEmailService from "../interface/utils/IEmailService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";
import { IDistributerRegisterCredentials } from "../interface/controllers/distributer.IAuth.controller";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import { IOTPDocument } from "../interface/collections/IOTP.collections";
import IOTPRepository from "../interface/repositories/OTP.IOTPRepository.interface";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";

export default class DistributerAuthUseCase implements IDistributerAuthUseCase {
    private distributerAuthRepository: IDistributerAuthRepository;
    private otpRepository: IOTPRepository;
    private hashingService: IHashingService;
    private otpService: IOTPService;
    private emailService: IEmailService;
    private jwtService: IJWTService;

    constructor(distributerAuthRepository: IDistributerAuthRepository, otpRepository: IOTPRepository, hashingService: IHashingService, otpService: IOTPService, emailService: IEmailService, jwtService: IJWTService, private cloudinaryService: ICloudinaryService) {
        this.distributerAuthRepository = distributerAuthRepository;
        this.otpRepository = otpRepository;
        this.hashingService = hashingService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    async authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never> {
     try {
        if(!email || !password) {
            throw new AuthenticationError({message: 'Provide All required fields.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
        }

        const distributerData: IDistributerDocument | null = await this.distributerAuthRepository.getDataByEmail(email);

        if(!distributerData) {
            throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
        }else if(!await this.hashingService.compare(password, distributerData.password)) {
            throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
        }else if(!distributerData.OTPVerificationStatus) {
            await this.generateAndSendOTP(distributerData.email); // send otp via email.

            throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOTPVerifiedErrorEmail: distributerData.email, cookieKeyForOTPVerification: 'distributerEmailToBeVerified'});
        }else if(!distributerData.documentVerificationStatus) {
            throw new AuthenticationError({message: 'document verification is still in process.', statusCode: StatusCodes.Unauthorized, errorField: "document"});
        }

        const payload: IPayload = {
            id: distributerData._id,
            type: 'Distributer'
        }
        const token: string = this.jwtService.sign(payload);

        return token;
     } catch (err: any) {
        throw err;
     }   
    }

    async register(registerData: IDistributerRegisterCredentials): Promise<void | never> {
        try {
            if(!registerData.name || !registerData.email || !registerData.phoneNumber || !registerData.password || !registerData.confirmPassword || !registerData.IDProof || !registerData.IDProofImage || !registerData.licence || !(/^[A-Za-z0-9]+@gmail\.com$/).test(registerData.email) || (registerData.phoneNumber.length !== 10) || (registerData.password !== registerData.confirmPassword) || (registerData.IDProofImage.length !== 2)) {
                throw new AuthenticationError({message: 'Provide all required details correctly.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
            }

            const isEmailTaken: IDistributerDocument | null = await this.distributerAuthRepository.getDataByEmail(registerData.email);
            const isPhoneNumberTaken: IDistributerDocument | null = await this.distributerAuthRepository.getDataByPhoneNumber(registerData.phoneNumber);

            if(isEmailTaken) {
                throw new AuthenticationError({message: 'The email address you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'email'});
            }else if(isPhoneNumberTaken) {
                throw new AuthenticationError({message: 'The PhoneNumber you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'phoneNumber'});
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);

            registerData.password = hashedPassword;

            const secureUrlIDProofImage: string[] = [];

            for(const imageDataBase64 of registerData.IDProofImage) {
                const secure_url = await this.cloudinaryService.uploadImage(imageDataBase64); // returns secure url
                secureUrlIDProofImage.push(secure_url);
            }

            registerData.IDProofImage = secureUrlIDProofImage; // change property value to array of secure url of the uploaded image to store it in database to see images

            const secure_url = await this.cloudinaryService.uploadImage(registerData.licence); // returns secure url
            registerData.licence = secure_url;

            await this.distributerAuthRepository.createDistributer(registerData);

            await this.generateAndSendOTP(registerData.email); // generate and send otp using email services
        } catch (err: any) {
            throw err;
        }
    }

    async OTPVerification(email: string | undefined, otp: string | undefined): Promise<string | never> {
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
            
            const distributerData: IDistributerDocument | null = await this.distributerAuthRepository.makeDistributerVerified(email); // return the updated document if found or null;

            const payload: IPayload = {
                id: distributerData?.id,
                type: 'Distributer'
            }

            const authToken: string = this.jwtService.sign(payload); // genrateing jwt token.

            return authToken; // for authing user by cookie
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
}