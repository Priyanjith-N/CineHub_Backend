export default interface IEmailService {
    sendEmail(to: string, subjcet: string, text: string): Promise<void | never>;
}

export interface IMailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}