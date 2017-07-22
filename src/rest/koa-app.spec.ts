/*
 * test the koa app.
 */
import {KoaApp} from './koa-app';
import {DomainServiceQuery} from '@flexxbizz/generic';
import {PersistenceHandler} from "../persistence/shared/db-context-handler";
const request = require('request');

class TestDb implements PersistenceHandler{
    closeConnection(): void {
    }

    queryEntities(collectionName: string, query: DomainServiceQuery): Promise<any[]> {
        return new Promise((resolve:any , reject: any) => {
            return resolve([collectionName,query.pagination.offset,query.pagination.limit,query.textSearch]);
        });
    }

    saveEntity(collectionName: string, object: any): Promise<any> {
        return undefined;
    }

    updateEntity(collectionName: string, object: any, id: string): Promise<any> {
        return undefined;
    }

    getEntity(collectionName: string, id: string): Promise<any> {
        return undefined;
    }

    deleteEntity(collectionName: string, id: string): Promise<any> {
        return undefined;
    }

}
describe('test the koa app:', () => {
    let app:KoaApp;
    let port = 2999;
    let base_url = 'http://localhost:'+port+'/';
    beforeAll(() => {
        app = new KoaApp(port,new TestDb());
        app.listen();
    });
    afterAll(() => {
        app.close();
    });
    it('should return hello word for /', (done) => {
        request.get(base_url, (error:any, response:any, body:any) =>{
            expect(response.statusCode).toBe(200);
            expect(body).toEqual('Hello World!');
            done();
        })
    });

    it('should return an array for persistence/test?offset=0&limit=50', (done) => {
        request.get(base_url+'persistence/test?offset=100&limit=50&search=test', (error:any, response:any, body:any) =>{
            expect(response.statusCode).toBe(200);
            console.log(body);
            expect(body).toEqual('["test",100,50,"test"]');
            done();
        })
    });
});