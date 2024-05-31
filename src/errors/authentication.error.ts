export interface ErrorDetails {
    statusCode?: number;
    message: string;
    errorField?: string;
}

export default class AuthenticationError extends Error {
    constructor(public details: ErrorDetails) {
        super(details.message);
    }
}