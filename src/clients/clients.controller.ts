import { Controller, Get } from '@nestjs/common';
import { DataService } from 'src/services/data.service';
import { IClients } from 'src/models/clients.interface';

@Controller('clients')
export class ClientsController {

    constructor(private _dataSvc: DataService) { }

    @Get()
    async getClients(): Promise<any[]> {

        return new Promise<any[]>(async (resolve, reject) => {
            const clients = await this._dataSvc.getCollection('Clients');
            const clientSessions = await this._dataSvc.getCollection('ClientSessions');
            const clientsWithSessions: IClients[] = clients.map(client => {
                const currentClientSessions = clientSessions.filter(session => client.ClientID === session.ClientID);
                return { ...client, SessionDetails: currentClientSessions };
            });
            resolve(clientsWithSessions);
        });
        
    }

}
