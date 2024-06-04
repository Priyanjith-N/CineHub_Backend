export default interface IEmailService {
    sendEmail(to: string, subjcet: string, text: string): Promise<void>;
}