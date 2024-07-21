// interfaces
import ITheaterOwnerAuthUseCase from "../interface/usecase/theaterOwner.IAuth.usecase";
import ITheaterOwnerAuthRepository from "../interface/repositories/theaterOwner.IAuth.repository";
import { ITheaterOwnerDocument } from "../interface/collections/ITheaterOwner.collection";
import IHashingService from "../interface/utils/IHashingService";
import IOTPService from "../interface/utils/IOTPService";
import IEmailService from "../interface/utils/IEmailService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";

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

    constructor(theaterOwnerAuthRepository: ITheaterOwnerAuthRepository, hashingService: IHashingService, otpService: IOTPService, emailService: IEmailService, jwtService: IJWTService) {
        this.theaterOwnerAuthRepository = theaterOwnerAuthRepository;
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