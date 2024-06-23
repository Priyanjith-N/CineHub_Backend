export interface ErrorDetails {
    statusCode: number;
    message: string;
}

export default class JWTTokenError extends Error {
    public details: ErrorDetails;
    constructor(details: ErrorDetails) {
        super(details.message);
        this.details = details;
    }
}