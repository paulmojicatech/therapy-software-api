import { MongoClient } from "mongodb";
import { Injectable } from "@nestjs/common";
import { mongoClient } from 'src/config/config';

@Injectable()

export class DataService {

    private _client = new MongoClient(mongoClient);
    private _db = 'pmt-itt';

    async getCollection(collectionName: string, options: any = {}): Promise<any[]> {
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
}