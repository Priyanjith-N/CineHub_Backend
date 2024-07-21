export default interface ITheaterOwnerAuthUseCase {
    authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never>;
}