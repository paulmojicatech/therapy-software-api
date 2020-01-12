import * as dotenv from 'dotenv';

dotenv.config();

export const MONGO_CONN = process.env.MongoConnString;
