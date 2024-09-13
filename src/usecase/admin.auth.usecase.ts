// interfaces
import IAdminAuthUseCase from "../interface/usecase/admin.IAuth.usecase";
import IAdminAuthRepository from "../interface/repositories/admin.IAuth.repository";
import IEmailService from "../interface/utils/IEmailService";
import IHashingService from "../interface/utils/IHashingService";
import IJWTService, { IAuthTokens, IPayload } from "../interface/utils/IJWTService";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// errors
import AuthenticationError from "../errors/authentication.error";
import JWTTokenError from "../errors/jwt.error";
import IAdmin from "../entity/admin.entity";

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

    async authenticateUser(email: string, password: string): Promise<IAuthTokens | never> {
        try {
            const adminData: IAdmin | null = await this.adminAuthRepository.getDataByEmail(email);

            if(!adminData) {
                throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
            }else if(!await this.hashingService.compare(password, adminData.password as string)) {
                throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
            }

            const payload: IPayload = {
                id: adminData._id,
                type: 'Admin'
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

    async verifyToken(authorizationHeader: string | undefined): Promise<void | never> {
        try {
            if(!authorizationHeader) {
                throw new JWTTokenError({ tokenName: "Token", statusCode: StatusCodes.Unauthorized, message: 'Admin not authenticated' })
            }

            const token = authorizationHeader.split(' ')[1];

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== 'Admin') {
                throw new JWTTokenError({ tokenName: "Token", statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }
        } catch (err: any) {
            throw err;
        }
    }
}