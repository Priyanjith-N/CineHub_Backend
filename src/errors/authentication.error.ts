// interfaces
import { IAuthenticationErrorDetails } from "../interface/errors/IAuthentication.error";

export default class AuthenticationError extends Error {
    public details: IAuthenticationErrorDetails;
    constructor(details: IAuthenticationErrorDetails) {
        super(details.message);
        this.details = details;
    }
} 