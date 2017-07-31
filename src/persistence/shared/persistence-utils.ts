import * as Router from "koa-router";
import {IRouterContext} from "koa-router";
import {PersistenceHandler} from "./";

export const collectionHandler = async(ctx, next) => {
    if (!ctx.params.collection || ctx.params.collection.length==0){
        throw Error('No collection name given!');
    }
    addCollectionNameToCtx(ctx.params.collection, ctx);
    let collName = getCollectionNameFromCtx(ctx);
    console.info(`got collection:  ${collName}`);
    await next();
};

/**
 * Middleware for adding dbhandler to ctx.
 * @param dbHandler
 * @returns {(ctx:any, next:any)=>Promise<undefined>}
 */
export const addDbHandlerToCtx = (dbHandler: PersistenceHandler): Router.IMiddleware => {
    return async(ctx, next) => {
        let extCtx: any = ctx;
        extCtx.dbHandler = dbHandler;
        console.info('dbHandler added to ctx');
        await next();
    }
};

export const getDbHandlerFromCtx = (ctx: IRouterContext): PersistenceHandler => {
    let extCtx: any = ctx;
    return extCtx.dbHandler;
};
/**
 * Helper to put collection name into ctx.
 * @param colName
 * @param ctx
 */
const addCollectionNameToCtx = (colName: string, ctx: any): void => {
    ctx.colletionName = colName;
};
/**
 * helper to get collection name from context.‚
 * @param ctx
 */
export const getCollectionNameFromCtx = (ctx: any) => {
    return ctx.colletionName;
};