import { MongoClient } from "mongodb";
import { Injectable } from "@nestjs/common";
import { mongoClient } from '../config/config';
import { resolve } from "dns";

@Injectable()

export class DataService {

    private _client = new MongoClient(mongoClient);
    private _db = 'pmt-itt-dev';

    async getCollection(collectionName: string, options: any = {}): 
        Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {

            let items: any[] = [];
           
            try {
                const client = await this.connect();
                await client
                    .db(this._db)
                    .collection(collectionName)
                    .find(options)
                    .forEach(item => {
                        items.push(item);
                    });
                resolve(items);
            }

            catch (ex) {
                reject(ex);
            }

            return items;

        });

    }

    async getlastDocumentInCollection(collectionName: string, 
        options: any = {}, 
        sort: any): Promise<any> {
        let lastItem = {};
        const mongoConn = await this.connect();
        await mongoConn
            .db(this._db)
            .collection(collectionName)
            .find(options)
            .sort(sort)
            .limit(1)
            .forEach(item => {
                lastItem = item;
            });
        return Promise.resolve(lastItem);
    }

    async addToCollection(collectionName: string, document: any): Promise<boolean> {
        let status = false;
        return new Promise<boolean>(async (resolve, reject) => {
            const client = await this.connect();
            await client
                .db(this._db)
                .collection(collectionName)
                .insertOne(document);
            status = true;
            resolve(status);
        });
    }

    async updateCollection(collectionName: string, options: any, document: any): Promise<boolean> {
        try {
            const mongoClient = await this.connect();
            await mongoClient
                .db(this._db)
                .collection(collectionName)
                .findOneAndUpdate(options, {$set: document});
            return Promise.resolve(true);
        } catch (err) {
            return Promise.reject(err);
        }
        
    }

    async deleteItemFromCollection(collectionName: string, deleteClause: any): Promise<void> {
        const client = await this.connect();
        await client
            .db(this._db)
            .collection(collectionName)
            .deleteOne(deleteClause);

        return Promise.resolve();
    }

    async disconnect(): Promise<void> {
        if (this._client?.isConnected()) {
            this._client.close(true);
        }
    }

    private async connect(): Promise<MongoClient> {
        return new Promise<MongoClient>(async(resolve, reject) => {
            try {
                await this._client.connect(async(err, db) => {
                    if (err) {
                        reject(err);                        
                    }
                    else {
                        resolve(db.connect());
                    }
                });
            }   
            catch(err) {
                reject(err);
            }
        });
    }

    private buildUpdateQuery(fields: any[]): any {
        let updateStatement = {};
        
        fields.forEach(field => {
            const key = Object.keys(field)[0];
            updateStatement[key] = field[key];
        });
        return updateStatement;
    }
}