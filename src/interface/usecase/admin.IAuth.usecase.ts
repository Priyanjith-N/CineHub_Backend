
export default interface IAdminAuthUseCase { 
    authenticateUser(email: string, password: string): Promise<string | never>;
    verifyToken(authorizationHeader: string | undefined): Promise<void | never>;
}