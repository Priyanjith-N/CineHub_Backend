// interfaces
import IAdminAuthUseCase from "../interface/usecase/admin.IAuth.usecase";
import IAdminAuthRepository from "../interface/repositories/admin.IAuth.repository";
import IEmailService from "../interface/utils/IEmailService";
import IHashingService from "../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";
import { IAdminDocument } from "../interface/collections/IAdmin.collections";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";
import JWTTokenError from "../errors/jwt.error";

export default class AdminAuthUseCase implements IAdminAuthUseCase {
    private adminAuthRepository: IAdminAuthRepository;
    private hashingService: IHashingService;
    private jwtService: IJWTService;
    private emailService: IEmailService;

    constructor(adminAuthRepository: IAdminAuthRepository, hashingService: IHashingService, emailService: IEmailService, jwtService: IJWTService) {
        this.adminAuthRepository = adminAuthRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    async authenticateUser(email: string, password: string): Promise<string | never> {
        try {
            const adminData: IAdminDocument | null = await this.adminAuthRepository.getDataByEmail(email);

            if(!adminData) {
                throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
            }else if(!await this.hashingService.compare(password, adminData.password as string)) {
                throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
            }

            const payload: IPayload = {
                id: adminData._id,
                type: 'Admin'
            }
            
            const token: string = this.jwtService.sign(payload);

            return token;
        } catch (err: any) {
            throw err;
        }
    }

    async verifyToken(token: string | undefined): Promise<void | never> {
        try {
            if(!token) {
                throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: 'Admin not authenticated' })
            }

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== 'Admin') {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }
        } catch (err: any) {
            throw err;
        }
    }
}