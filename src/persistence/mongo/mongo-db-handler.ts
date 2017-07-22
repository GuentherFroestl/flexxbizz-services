/**
 * Created by gfr on 07.01.17.
 */
import {PersistenceHandler} from "../shared/index";
import {DomainServiceQuery} from '@flexxbizz/generic';
import {Cursor} from "mongodb";
//const mongoDb = require('mongodb');
import * as mongoDb from 'mongodb'
const mongoClient = new mongoDb.MongoClient();
const MongoObjectID = mongoDb.ObjectID;

/**
 * Provider for mongoClient Connection.
 */
export class MongoDbHandler implements PersistenceHandler {


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
            console.info('got new db-connection');
        }
        return this.connection;
    };

    closeConnection(): void {
        if (this.connection) {
            this.connection.close();
            console.info('close mongoDb connection');
        }
    }

    async queryEntities(collectionName: string, query: DomainServiceQuery): Promise<any[]> {
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let mdbq = {};
        if (query.textSearch) {
            mdbq = {
                $text: {
                    $search: query.textSearch
                }
            };
        }
        let findResult = await collection.find(mdbq);
        let count = await findResult.count();
        console.info('find result count:', count);
        let result = await findResult.skip(query.pagination.offset).limit(query.pagination.limit).toArray();
        return result;
    }

    async saveEntity(collectionName: string, object: any): Promise<any> {
        if (!object) {
            throw new Error("Entity to be saved must be not null or undefined");
        }
        if (!object._id) {
            object._id = new MongoObjectID();
        }
        console.info('insert object :', object);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let cmdResult = await collection.insertOne(object);
        console.info('insert object result :', cmdResult.result, cmdResult.ops);
        return {id: object._id};
    }

    async updateEntity(collectionName: string, entity: any, id: string): Promise<any> {
        if (!entity || !id) {
            throw new Error("Entity and id to be updated must be not null or undefined");
        }
        console.info('update object :', entity);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let obj_id = MongoObjectID.createFromHexString(id);
        let uObj = Object.assign({}, entity, {_id: obj_id});
        let cmdResult = await collection.updateOne(
            {"_id": MongoObjectID.createFromHexString(id)},
            uObj
        );
        console.info('update object result :', cmdResult.result);
        return {
            cmdResult: cmdResult.result,
            entity: uObj
        };
    }

    async getEntity(collectionName: string, id: string): Promise<any> {
        if (!id) {
            throw new Error("id of for requested entity must be defined");
        }
        console.info('retrieve object by id:', id);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let result: any[] = await collection.find({_id: MongoObjectID.createFromHexString(id)}).limit(1).toArray();
        console.info('found objects :', result);
        if (result || result.length > 0) {
            return result[0];
        } else {
            return undefined;
        }

    }

    async deleteEntity(collectionName: string, id: string): Promise<any> {
        if (!id) {
            throw new Error("id of for requested entity must be defined");
        }
        console.info('delete object by id:', id);
        let conn = await this.connect();
        let collection = conn.collection(collectionName);
        let cmdResult = await collection.deleteOne(
            {_id: MongoObjectID.createFromHexString(id)}
        );
        console.info('delete object result :', cmdResult.result);
    }
}