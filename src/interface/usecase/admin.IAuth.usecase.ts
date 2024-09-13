import { IAuthTokens } from "../utils/IJWTService";

export default interface IAdminAuthUseCase { 
    authenticateUser(email: string, password: string): Promise<IAuthTokens | never>;
    verifyToken(authorizationHeader: string | undefined): Promise<void | never>;
}