import AuthenticationError from "../errors/authentication.error";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import IAuthRepository from "../interface/repositories/IAuth.repositories";
import IAuthUseCase from "../interface/usecase/IAuth.usecase";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async authenticateUser(email: string, password: string): Promise<void> {
        try {
            const userData: IUserDocument | null = await this.authRepository.getDataByEmail(email);

            if(!userData){
                throw new AuthenticationError({message: 'The provided email address is not found.', statusCode: 401, errorField: 'email'});
            }
        } catch (err: any) {
            throw err;
        }
    }
}