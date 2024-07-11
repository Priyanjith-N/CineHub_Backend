
export default interface IAdminAuthUseCase { 
    authenticateUser(email: string, password: string): Promise<string | never>;
}