
export default interface IAdminAuthUseCase { 
    authenticateUser(email: string, password: string): Promise<string | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
}