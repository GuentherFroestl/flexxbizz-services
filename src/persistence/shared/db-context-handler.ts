/**
 * Created by gfr on 07.01.17.
 */
/**
 * Interface for persistence CRUDL handling
 */
export interface PersistenceHandler {
    closeConnection(): void;
    listEntities(collectionName: string, offset: number, limit: number): Promise<any[]>;
    saveEntity(collectionName: string, object: any): Promise<any>;
    updateEntity(collectionName: string, object: any, id: string): Promise<any>;
    getEntity(collectionName: string, id: string): Promise<any>;
    deleteEntity(collectionName: string, id: string): Promise<any>;
}

export const collectionHandler = async(ctx, next) => {
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
export const addDbHandlerToCtx = (dbHandler: PersistenceHandler): any => {
    return async(ctx, next) => {
        ctx.dbHandler = dbHandler;
        console.info('dbHandler added to ctx');
        await next();
    }
};

export const getDbHandlerFromCtx = (ctx: any): PersistenceHandler => {
    return ctx.dbHandler;
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