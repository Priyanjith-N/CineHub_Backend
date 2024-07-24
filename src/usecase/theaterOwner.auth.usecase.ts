// interfaces
import ITheaterOwnerAuthUseCase from "../interface/usecase/theaterOwner.IAuth.usecase";
import ITheaterOwnerAuthRepository from "../interface/repositories/theaterOwner.IAuth.repository";
import { ITheaterOwnerDocument } from "../interface/collections/ITheaterOwner.collection";
import IHashingService from "../interface/utils/IHashingService";
import IOTPService from "../interface/utils/IOTPService";
import IEmailService from "../interface/utils/IEmailService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";
import { ITheaterOwnerRegisterCredentials } from "../interface/controllers/theaterOwner.IAuth.controller";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import { IOTPDocument } from "../interface/collections/IOTP.collections";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";

export default class TheaterOwnerAuthUseCase implements ITheaterOwnerAuthUseCase {
    private theaterOwnerAuthRepository: ITheaterOwnerAuthRepository;
    private hashingService: IHashingService;
    private otpService: IOTPService;
    private emailService: IEmailService;
    private jwtService: IJWTService;
    private cloudinaryService: ICloudinaryService;

    constructor(theaterOwnerAuthRepository: ITheaterOwnerAuthRepository, hashingService: IHashingService, otpService: IOTPService, emailService: IEmailService, jwtService: IJWTService, cloudinaryService: ICloudinaryService) {
        this.theaterOwnerAuthRepository = theaterOwnerAuthRepository;
        this.hashingService = hashingService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.cloudinaryService = cloudinaryService;
    }

    async authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never> {
     try {
        if(!email || !password) {
            throw new AuthenticationError({message: 'Provide All required fields.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
        }

        const theaterOwnerData: ITheaterOwnerDocument | null = await this.theaterOwnerAuthRepository.getDataByEmail(email);

        if(!theaterOwnerData) {
            throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
        }else if(!await this.hashingService.compare(password, theaterOwnerData.password)) {
            throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
        }else if(!theaterOwnerData.OTPVerificationStatus) {
            await this.generateAndSendOTP(theaterOwnerData.email); // send otp via email.

            throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOTPVerifiedErrorEmail: theaterOwnerData.email, cookieKeyForOTPVerification: 'theaterOwnerEmailToBeVerified'});
        }else if(!theaterOwnerData.documentVerificationStatus) {
            throw new AuthenticationError({message: 'document verification is still in process.', statusCode: StatusCodes.Unauthorized, errorField: "document"});
        }

        const payload: IPayload = {
            id: theaterOwnerData._id,
            type: 'TheaterOwner'
        }
        const token: string = this.jwtService.sign(payload);

        return token;
     } catch (err: any) {
        throw err;
     }   
    }

    async register(registerData: ITheaterOwnerRegisterCredentials): Promise<void | never> {
        try {
            if(!registerData.name || !registerData.email || !registerData.phoneNumber || !registerData.password || !registerData.confirmPassword || !registerData.IDProof || !registerData.IDProofImage || !(/^[A-Za-z0-9]+@gmail\.com$/).test(registerData.email) || (registerData.phoneNumber.length !== 10) || (registerData.password !== registerData.confirmPassword) || (registerData.IDProofImage.length !== 2)) {
                throw new AuthenticationError({message: 'Provide all required details correctly.', statusCode: StatusCodes.BadRequest, errorField: 'Required'});
            }

            const isEmailTaken: ITheaterOwnerDocument | null = await this.theaterOwnerAuthRepository.getDataByEmail(registerData.email);
            const isPhoneNumberTaken: ITheaterOwnerDocument | null = await this.theaterOwnerAuthRepository.getDataByPhoneNumber(registerData.phoneNumber);

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

            await this.theaterOwnerAuthRepository.createTheaterOwner(registerData);

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

            const otpData: IOTPDocument | null = await this.theaterOwnerAuthRepository.getOTPByEmail(email);

            if(!otpData) {
                throw new AuthenticationError({message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }else if(otpData.otp !== otp) {
                throw new AuthenticationError({message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp'});
            }

            const theaterOwnerData: ITheaterOwnerDocument | null = await this.theaterOwnerAuthRepository.makeTheaterOwnerVerified(email); // return the updated document if found or null;

            const payload: IPayload = {
                id: theaterOwnerData?.id,
                type: 'TheaterOwner'
            }

            const authToken: string = this.jwtService.sign(payload); // genrateing jwt token.

            return authToken; // for authing user by cookei
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

            await this.theaterOwnerAuthRepository.createOTP(email, otp); // saving otp in database
        } catch (err: any) {
            throw err;
        }
    }
}