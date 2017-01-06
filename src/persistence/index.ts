/**
 * Created by gfr on 06.01.17.
 */

export const persistenceRouter = require('koa-router')();
const crudRouter = require('koa-router')();

const collectionHandler = async(ctx, next) => {
    ctx.collectionId = ctx.params.collection;
    console.info(`got collection:  ${ctx.collectionId}`);
    next();
};

crudRouter.get('/', async(ctx, next) => {
    ctx.body = `List collection ${ctx.collectionId}`;
});

crudRouter.get('/:id', async(ctx, next) => {
    ctx.body = `Get entity from collection ${ctx.collectionId} with id: ${ctx.params.id}`;
});

persistenceRouter.use('/persistence/:collection', collectionHandler, crudRouter.routes(), crudRouter.allowedMethods());
