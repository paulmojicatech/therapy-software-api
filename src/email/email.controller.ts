import { Controller, Post } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';

@Controller('email')
export class EmailController {
    constructor (private _emailSvc: EmailService) { }

    @Post()
    async sendEmail(): Promise<boolean> {
        try {
            const isSuccess = await this._emailSvc.sendEmail('paulmojicatech@gmail.com', 'Testing', 'New Email From Node');
            return Promise.resolve(isSuccess);
        } catch (ex) {
            console.log('ERR', ex);
            return Promise.resolve(false);
        }

    }
}
