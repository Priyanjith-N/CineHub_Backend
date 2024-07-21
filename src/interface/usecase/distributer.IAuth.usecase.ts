export default interface IDistributerAuthUseCase {
    authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never>;
}