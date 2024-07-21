export interface IAuthenticationErrorDetails {
    statusCode?: number;
    message: string;
    errorField?: string;
    notOTPVerifiedErrorEmail?: string | undefined;
}