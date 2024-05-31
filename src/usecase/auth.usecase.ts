import { IUserDocument } from "../interface/collections/IUsers.collections";
import IAuthRepository from "../interface/repositories/IAuth.repositories";
import IAuthUseCase from "../interface/usecase/IAuth.usecase";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async authenticateUser(email: string, password: string): Promise<void> {
        const userData: IUserDocument | null = await this.authRepository.getDataByEmail(email);

        if(!userData){
            // no user with that email already exist
        }
    }
}