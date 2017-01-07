/**
 * Created by gfr on 07.01.17.
 */
import {DbHandler} from "../shared/index";
const mongoDb = require('mongodb');
const mongoClient = mongoDb.MongoClient;
const mongoObjectID = mongoDb.ObjectID;

/**
 * Provider for mongoClient Connection.
 */
export class MongoDbHandler implements DbHandler {


    private connection;

    constructor(private dbUrl: string) {
    }


    /**
     * async connects to database
     * @returns {Promise<any>} of connection
     */
    private async connect(): Promise<any> {
        if (!this.connection) {
            console.info('try to get db-connection');
            this.connection = await mongoClient.connect(this.dbUrl);
            console.info('got db-connection');
        }
        console.info('got db-connection');
        return this.connection;
    };

    closeConnection(): void {
        if (this.connection) {
            this.connection.close();
            console.info('close mongoDb connection');
        }
    }

    async listEntities(collectionName: string, offset: number, limit: number): Promise<any[]> {
        let conn = await this.connect();
        console.info('got db-connection');
        let collection = conn.collection(collectionName);
        let result = await collection.find().skip(offset).limit(limit).toArray();
        console.info('got db-connection');
        return result;
    }

    async saveEntity(collectionName: string, object: any): Promise<any> {
        if (!object) {
            throw new Error("Entity to be saved must be not null or undefined");
        }
        if (!object._id) {
            object._id = mongoObjectID();
        }
        console.info('insert object :', object);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let cmdResult = await collection.insertOne(object);
        console.info('insert object result :', cmdResult.result,cmdResult.ops);
        return {id: object._id};
    }

    async updateEntity(collectionName: string, object: any, id: string): Promise<any> {
        if (!object || !id) {
            throw new Error("Entity and id to be saved must be not null or undefined");
        }
        object._id = id;
        console.info('insert object :', object);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let result = await collection.insertOne(object);
        console.info('insert object result :', result);
        return {id: object._id};
    }

    async getEntity(collectionName: string, id: string): Promise<any> {
        if (!id) {
            throw new Error("id of for requested entity must be defined");
        }
        console.info('retrieve object by id:', id);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let result = await collection.find({_id: id}).limit(1);
        console.info('found object :', result);
        return result
    }
}