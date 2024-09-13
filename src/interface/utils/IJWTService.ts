export interface IPayload {
    id: string,
    type: "Admin" | "Distributer" | "TheaterOwner" | "User"
}

export default interface IJWTService {
    sign(payload: IPayload, expiresIn: string | number): string | never;
    verifyToken(token: string): IPayload | never;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}