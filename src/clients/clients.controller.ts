import { Controller, Get, Put, Body, Post, Param, Delete } from '@nestjs/common';
import { DataService } from '../services/data.service';
import { IClients, IClientSessionDetails } from '../models/clients.interface';

@Controller('clients')
export class ClientsController {

    // tslint:disable-next-line: variable-name
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
            } finally {
                this._dataSvc.disconnect();
            }
        });

    }

    @Post()
    async addClient(@Body() newClient: { headers: any, body: any}): Promise<any> {

        return new Promise<any>(async (resolve, reject) => {
            try {
                let newClientInstance = newClient.body.newClient;
                const lastClient = await this._dataSvc.getlastDocumentInCollection('Clients', {}, { ClientID: -1});
                const clientId = lastClient ? lastClient.ClientID + 1 : 1;
                newClientInstance = {...newClientInstance, ClientID: clientId};
                await this._dataSvc.addToCollection('Clients', newClientInstance);

                resolve({ GeneralDetails: newClientInstance });
            } catch (ex) {
                reject(ex);
            } finally {
                this._dataSvc.disconnect();
            }
        });
    }

    @Post(':id/clientSessions')
    async addClientSession(@Param('id') id: string, @Body() sessionDetails:{ headers: any, body: any}): 
        Promise<IClients> {
        try {
            const clientId = +id;
            const lastClientSession = await this._dataSvc.getlastDocumentInCollection('ClientSessions', 
                {}, 
                { ClientSessionID: -1 });
            const newSessionID = !!lastClientSession.ClientSessionID ? 
                lastClientSession.ClientSessionID + 1 :
                1;
            const newSession = {
                ClientSessionID: newSessionID,
                ClientID: clientId,
                ClientSessionDate: sessionDetails.body.ClientSessionDate
            };

            await this._dataSvc.addToCollection('ClientSessions', newSession);
            const updatedClients = await this._dataSvc.getCollection('Clients', { ClientID: clientId});
            const updatedClient = updatedClients.find(client => client.ClientID === clientId);
            const updatedClientSessions = await this._dataSvc.getCollection('ClientSessions', { ClientID: clientId});

            return Promise.resolve({GeneralDetails: updatedClient, SessionDetails: updatedClientSessions });
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this._dataSvc.disconnect();
        }
    }

    @Put(':id')
    async updateClient(@Param('id') id: string, @Body() updatedClientReq:{ headers: any, body: { updatedClient: IClients }}): 
        Promise<IClients> {
        try {

            const where = { ClientID: +id };
            const success = await this._dataSvc.updateCollection('Clients', where, updatedClientReq.body.updatedClient.GeneralDetails);
            if (success) {
                const updatedClients: IClients[] = await this._dataSvc.getCollection('Clients', where);
                if (updatedClients?.length) {

                    const clientSessions = await this._dataSvc.getCollection('ClientSessions', where);
                    const updateClient = {...updatedClients[0], ClientSessions: clientSessions };
                    return Promise.resolve(updateClient);
                }
            } else {
                return Promise.reject('Error updating client');
            }
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this._dataSvc.disconnect();
        }
    }

    @Put(':id/clientSessions/:clientSessionId')
    async updateClientSession(@Param('id') id: string, @Param('clientSessionId') clientSessionId: string,
                              // tslint:disable-next-line: max-line-length
                              @Body() updatedClientSessionReq: { headers: any, body: {updatedClientSession: IClientSessionDetails }}): Promise<IClientSessionDetails> {
            try {
                const where = { ClientSessionID: +clientSessionId };
                const isoDateStr = new Date(updatedClientSessionReq.body.updatedClientSession.ClientSessionDate).toISOString();
                const updatedSession = {...updatedClientSessionReq.body.updatedClientSession, 
                    ClientSessionDate: isoDateStr};
                const success = await this._dataSvc.updateCollection('ClientSessions', where, updatedSession);
                if (success) {
                    return Promise.resolve(updatedSession);
                } else {
                    return Promise.reject('Error: Client Session was not updated correctly');
                }
            } catch (err) {
                return Promise.reject(err);
            } finally {
                this._dataSvc.disconnect();
            }
    }

    @Delete(':id')
    async deleteClient(@Param('id') id: string): Promise<number> {

        try {
            const deleteClause = {
                ClientID: +id
            };

            await this._dataSvc.deleteItemFromCollection('Clients', deleteClause);

            return Promise.resolve(+id);
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this._dataSvc.disconnect();
        }
    }

    @Delete(':id/clientSessions/:clientSessionId')
    async deleteClientSession(@Param('id') id: string, @Param('clientSessionId') clientSessionId: string):
        Promise<any[]> {
            try {
                const deleteClause = {
                    ClientSessionID: +clientSessionId
                };
                await this._dataSvc.deleteItemFromCollection('ClientSessions', deleteClause);
                const updatedClients = await this._dataSvc.getCollection('Clients');
                return Promise.resolve(updatedClients);
            } catch (err) {
                return Promise.reject(err);
            } finally {
                this._dataSvc.disconnect();
            }
        }


}
