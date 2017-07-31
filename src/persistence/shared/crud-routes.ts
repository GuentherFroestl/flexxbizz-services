/**
 * Created by gfr on 07.01.17.
 */
import {getCollectionNameFromCtx, PersistenceHandler, getDbHandlerFromCtx} from './';
import {DomainServiceQuery,ResultPageSecification} from '@flexxbizz/generic';
import * as KoaBody from 'koa-body';
import * as Router from 'koa-router';

export const crudRouter = new Router();
const bodyMW = new KoaBody();


crudRouter.get('/', async(ctx, next) => {
    let collectionName = getCollectionNameFromCtx(ctx);
    let handler: PersistenceHandler = getDbHandlerFromCtx(ctx);
    console.info(`List collection ${collectionName}`, "query", ctx.query);
    let resp = await handler.queryEntities(collectionName, buildDomainQuery(ctx.query));
    ctx.body = JSON.stringify(resp);
    await next();
});

crudRouter.get('/:id', async(ctx, next) => {
    let collectionName = getCollectionNameFromCtx(ctx);
    let handler: PersistenceHandler = getDbHandlerFromCtx(ctx);
    console.info(`Get entity from collection ${collectionName} with id: ${ctx.params.id}`);
    let resp = await handler.getEntity(collectionName, ctx.params.id);
    ctx.body = JSON.stringify(resp);
    console.info("response", ctx.body);
    await next();
});

crudRouter.delete('/:id', async(ctx, next) => {
    let collectionName = getCollectionNameFromCtx(ctx);
    let handler: PersistenceHandler = getDbHandlerFromCtx(ctx);
    console.info(`Delete entity from collection ${collectionName} with id: ${ctx.params.id}`);
    let resp = await handler.deleteEntity(collectionName, ctx.params.id);
    ctx.body = JSON.stringify(resp);
    console.info("response", ctx.body);
    await next();
});

crudRouter.post('/', bodyMW, async(ctx, next) => {
    let collectionName = getCollectionNameFromCtx(ctx);
    let handler: PersistenceHandler = getDbHandlerFromCtx(ctx);
    let reqWithBody: any = ctx.request;
    console.info(`post entity to collection ${collectionName} with payload:`, reqWithBody.body);
    let resp = await handler.saveEntity(collectionName, reqWithBody.body);
    ctx.body = JSON.stringify(resp);
    ctx.status=201;
    ctx.set('_uuid', resp.id);
    console.info("response", ctx.body);
    await next();
});

crudRouter.put('/:id', bodyMW, async(ctx, next) => {
    if (!ctx.params.id) {
        throw new Error("path-param for id must be set for putEntity");
    }
    let collectionName = getCollectionNameFromCtx(ctx);
    let handler: PersistenceHandler = getDbHandlerFromCtx(ctx);
    let reqWithBody: any = ctx.request;
    console.info(`put entity to collection ${collectionName} with payload:`, reqWithBody.body);
    let resp = await handler.updateEntity(collectionName, reqWithBody.body, ctx.params.id);
    ctx.body = JSON.stringify(resp);
    console.info("response", ctx.body);
    await next();
});

function getLimit(query: any): number {
    let limit = 1000;
    if (query.limit) {
        limit = 0 + query.limit;
    }
    return limit;
}

function buildDomainQuery(query: any): DomainServiceQuery{
    let dq = new DomainServiceQuery();
    dq.pagination= new ResultPageSecification();
    if (query.offset) {
        dq.pagination.offset = Number(query.offset);
    }
    if (query.limit) {
        dq.pagination.limit = Number(query.limit);
    }
    if(query.search){
        dq.textSearch=query.search;
    }
    console.info('donaimQuery:',dq);
    return dq;
}
