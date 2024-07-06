export default interface IOTPService {
    generateOTP(length?: number, characters?: string): string | never;
}