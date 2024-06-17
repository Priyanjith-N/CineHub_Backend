export interface ErrorDetails {
    statusCode?: number;
    message: string;
    errorField?: string;
}

export default class AuthenticationError extends Error {
    public details: ErrorDetails;
    constructor(details: ErrorDetails) {
        super(details.message);
        this.details = details;
    }
} 