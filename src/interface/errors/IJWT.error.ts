export interface IJWTTokenErrorDetails {
    tokenName: "Token" | "RefreshToken";
    statusCode: number;
    message: string;
}