// interfaces
import IDistributerAuthUseCase from "../interface/usecase/distributer.IAuth.usecase";
import IDistributerAuthRepository from "../interface/repositories/distributer.IAuth.repository";
import { IDistributerDocument } from "../interface/collections/IDistributer.collection";
import IHashingService from "../interface/utils/IHashingService";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";
import IOTPService from "../interface/utils/IOTPService";
import IEmailService from "../interface/utils/IEmailService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";

export default class DistributerAuthUseCase implements IDistributerAuthUseCase {
    private distributerAuthRepository: IDistributerAuthRepository;
    private hashingService: IHashingService;
    private otpService: IOTPService;
    private emailService: IEmailService;
    private jwtService: IJWTService;

    constructor(distributerAuthRepository: IDistributerAuthRepository, hashingService: IHashingService, otpService: IOTPService, emailService: IEmailService, jwtService: IJWTService) {
        this.distributerAuthRepository = distributerAuthRepository;
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

            throw new AuthenticationError({message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOTPVerifiedErrorEmail: distributerData.email});
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

    private async generateAndSendOTP(email: string): Promise<void | never> {
        try {
            const otp: string = this.otpService.generateOTP();

            const to: string = email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            await this.distributerAuthRepository.createOTP(email, otp); // saving otp in database
        } catch (err: any) {
            throw err;
        }
    }
}