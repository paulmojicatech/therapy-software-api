import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';
import { DataService } from 'src/services/data.service';
import { IClients } from 'src/models/clients.interface';
@Controller('email')
export class EmailController {
    constructor (private _emailSvc: EmailService, private _dataSvc: DataService) { }

    @Post('massEmail')
    async sendMassEmail(@Body() emailReq: { headers: any, body: { subject: string, message: string, clientsToInclude: number[] } }): Promise<boolean> {
        try {
            const clientsWhere = { $and: [ 
                {
                    ClientID: {
                        $in: emailReq.body.clientsToInclude
                    }
                },
                { 
                    ClientEmail: { 
                        $not: { 
                            $type: 10 // null type
                        }, 
                        $ne: "" // empty strings
                    } 
                } 
            ]};

            const clientsToSendTo = await this._dataSvc.getCollection('Clients', clientsWhere);
            if (!!clientsToSendTo) {
                clientsToSendTo.forEach(async client => {
                    await this._emailSvc.sendEmail(client.ClientEmail, emailReq.body.subject, emailReq.body.message);
                });
            }

            return Promise.resolve(true);
        } catch (ex) {
            console.log('ERR', ex);
            return Promise.resolve(false);
        } finally {
            this._dataSvc.disconnect();
        }

    }
}
