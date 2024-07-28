export default class RequiredCredentialsNotGiven extends Error {
    errMessage: string | undefined;
    constructor(errMessage: string) {
        super(errMessage);
    }
} 