import { Controller, Get, Put, Body, Post, Param, Delete } from '@nestjs/common';
import { DataService } from '../services/data.service';
import { IClients } from '../models/clients.interface';
import { json } from 'body-parser';

@Controller('clients')
export class ClientsController {

    constructor(private _dataSvc: DataService) { }

    @Get()
    async getClients(): Promise<any[]> {

        return new Promise<any[]>(async (resolve, reject) => {
            try {
                const clients = await this._dataSvc.getCollection('Clients');
                const clientSessions = await this._dataSvc.getCollection('ClientSessions');
                const clientsWithSessions: IClients[] = clients.map(client => {
                    const currentClientSessions = clientSessions.filter(session => client.ClientID === session.ClientID);
                    return { ...client, SessionDetails: currentClientSessions };
                });
                resolve(clientsWithSessions);
            } catch (ex) {
                reject(ex);
            }
        });
        
    }

    @Post()
    async addClient(@Body() newClient: { headers: any, body: any}): Promise<any> {

        return new Promise<any>(async (resolve, reject) => {
            try {
                const allClients = await this._dataSvc.getCollection('Clients');
                let newClientInstance = newClient.body.newClient;
                const lastClient = allClients.sort((a, b) => b - a)[0];
                const clientId = lastClient ? lastClient.ClientID + 1 : 1;
                newClientInstance = {...newClientInstance, ClientID: clientId};
                await this._dataSvc.addToCollection('Clients', newClientInstance);
                
                resolve({
                    status: 'success',
                    message: `${newClientInstance.ClientName} added successfully`
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    @Delete(':id')
    async deleteClient(@Param('id') id: string): Promise<{ status: string, message: string }> {

        const deleteClause = {
            ClientID: +id
        };

        await this._dataSvc.deleteItemFromCollection('Clients', deleteClause);

        return Promise.resolve({
            status: 'sucess',
            message: 'Client has been deleted'
        });
    }

    @Post(':id/clientSessions')
    async addClientSession(@Param('id') id: string, @Body() sessionDetails:{ ClientSessionDate: 'string'}): 
        Promise<{ status: string, message: string }> {
        const clientId = +id;
        const where = { ClientID: clientId };
        const lastClientSession = await this._dataSvc.getlastDocumentInCollection('ClientSessions', 
            where, 
            { ClientSessionID: -1 });
        const newSessionID = lastClientSession.ClientSessionID + 1;
        const newSession = {
            ClientSessionID: newSessionID,
            ClientID: clientId,
            ClientSessionDate: sessionDetails.ClientSessionDate
        };

        await this._dataSvc.addToCollection('ClientSessions', newSession);

        return Promise.resolve({
            status: 'success',
            message: `
                ${JSON.stringify(newSession)} has been added.
            `
        });
    }

    @Delete(':id/clientSessions/:clientSessionId')
    async deleteClientSession(@Param('id') id: string, @Param('clientSessionId') clientSessionId: string):
        Promise<{ status: string, message: string}> {

            const deleteClause = {
                ClientSessionID: +clientSessionId
            };
            await this._dataSvc.deleteItemFromCollection('ClientSessions', deleteClause);
            return Promise.resolve({
                status: 'success',
                message: 'Client Session has been deleted'                
            });
        }


}
