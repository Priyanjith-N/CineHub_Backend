import { StatusCodes } from "../enums/statusCode.enum";
import JWTTokenError from "../errors/jwt.error";
import IRefreshTokenAuthUseCase from "../interface/usecase/IRefreshToken.IAuth.usecase";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";

export default class RefreshTokenAuthUseCase implements IRefreshTokenAuthUseCase {
    private jwtService: IJWTService;

    constructor(jwtService: IJWTService) {
        this.jwtService = jwtService;
    }

    async getNewAccessTokenWithRefreshToken(refreshToken: string | undefined): Promise<string | never> {
        try {
            if(!refreshToken) throw new JWTTokenError({ tokenName: "RefreshToken", message: "NOT AUTHENTICATED", statusCode: StatusCodes.Unauthorized });

            const decoded: IPayload = this.jwtService.verifyToken(refreshToken);

            const payload: IPayload = {
                id: decoded.id,
                type: decoded.type
            }
            
            const accessToken: string = this.jwtService.sign(payload, "15m");
            
            return accessToken;
        } catch (err: any) {
            if(err instanceof JWTTokenError) throw err;

            throw new JWTTokenError({ tokenName: "RefreshToken", message: "Token expired", statusCode: StatusCodes.Unauthorized });
        }
    }
}