import crypto from 'crypto';
import nodemailer from 'nodemailer';
import IEmailService from "../../interface/utils/IEmailService";

export default class EmailService implements IEmailService {
    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        });

        const OTP: string = this.generateOTP();
    }

    private generateOTP(length: number = 6, characters: string = '0123456789'): string {
        const buffer = crypto.randomBytes(Math.ceil(length / 2));
        let OTP: string = '';
        for(let i = 0;i < length; i++) {
            const randomIndex: number = buffer[Math.floor(i / 2)] % characters.length;
            OTP += characters[randomIndex];
        }
        return OTP;
    }
}