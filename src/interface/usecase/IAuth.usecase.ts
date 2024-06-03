export default interface IAuthUseCase {
    authenticateUser(email: string, password: string): Promise<string>;
}

