import * as nodemailer from 'nodemailer';
import { SMTP_PORT, FROM_EMAIL, FROM_PWD, SMTP_SERVER, FROM_EMAIL_TITLE, FROM_EMAIL_FIRST_NAME, FROM_EMAIL_MIDDLE_NAME, FROM_EMAIL_LAST_NAME } from '../config/config';

export class EmailService {
    constructor() { }

    async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
        let isSuccess = false;
        try {
            const transporter = nodemailer.createTransport({
                host: SMTP_SERVER,
                port: SMTP_PORT,
                secure: false,
                auth: {
                    user: FROM_EMAIL,
                    pass: FROM_PWD
                }
            });
            const fromDisplay = `${FROM_EMAIL_FIRST_NAME} ${FROM_EMAIL_MIDDLE_NAME} ${FROM_EMAIL_LAST_NAME}, ${FROM_EMAIL_TITLE}`;
            await transporter.sendMail({
                from: `"${fromDisplay}" ${FROM_EMAIL}`,
                to,
                subject,
                text: message
            });
            isSuccess = true;

        } catch (ex) {
            console.log('ERR', ex);
            
        } finally {
            return Promise.resolve(isSuccess);
        }
        
    }

}