import IAuthUseCase from "../interface/usecase/IAuth.usecase";

export default class AuthUseCase implements IAuthUseCase {
    constructor() {}

    async authenticateUser(email: string, password: string): Promise<void> {
        console.log('here');
    }
}