import { StatusCodes } from "../../enums/statusCode.enum";
import IAuthUseCase from "../../interface/usecase/admin/IAuth.usecase";
import AuthenticationError from "../../errors/authentication.error";
import JWTTokenError from "../../errors/jwt.error";
import IEmailService from "../../interface/utils/IEmailService";
import IHashingService from "../../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";
import IAuthRepository from "../../interface/repositories/admin/IAuth.repository";
import { IAdminDocument } from "../../interface/collections/IAdmin.collections";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    private hashingService: IHashingService;
    private jwtService: IJWTService;
    private emailService: IEmailService;

    constructor(authRepository: IAuthRepository, hashingService: IHashingService, emailService: IEmailService, jwtService: IJWTService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    async authenticateUser(email: string, password: string): Promise<string | never> {
        try {
            const adminData: IAdminDocument | null = await this.authRepository.getDataByEmail(email);

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
}