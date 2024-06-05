import nodemailer from 'nodemailer';
import IEmailService, { IMailOptions } from "../../interface/utils/IEmailService";

export default class EmailService implements IEmailService {
    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS
                }
            });
    
            const mailOptions: IMailOptions = {
                from: `"CineHub" ${process.env.AUTH_EMAIL}`,
                to: to,
                subject: subject,
                text: text
            };
    
            await transporter.sendMail(mailOptions);
        } catch (err: any) {
            throw err;
        }
    }
}