import { StatusCodes } from "../enums/statusCode.enum";
import AuthenticationError from "../errors/authentication.error";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import IAuthRepository from "../interface/repositories/IAuth.repositories";
import IAuthUseCase from "../interface/usecase/IAuth.usecase";
import IHashingService from "../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    private hashingService: IHashingService;
    private jwtService: IJWTService;
    constructor(authRepository: IAuthRepository, hashingService: IHashingService, jwtService: IJWTService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }

    async authenticateUser(email: string, password: string): Promise<string> {
        try {
            const userData: IUserDocument | null = await this.authRepository.getDataByEmail(email);

            if(!userData) {
                throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email'});
            }else if(!await this.hashingService.compare(password, userData.password as string)) {
                throw new AuthenticationError({message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password'});
            }else if(!userData.OTPVerification) {
                throw new AuthenticationError({message: 'Account it not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp"});
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
}