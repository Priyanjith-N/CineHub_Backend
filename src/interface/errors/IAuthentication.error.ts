export interface IAuthenticationErrorDetails {
    statusCode?: number;
    message: string;
    errorField?: string;
    notOTPVerifiedError?: string | undefined;
}