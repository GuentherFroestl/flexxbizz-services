/**
 * Created by gfr on 06.01.17.
 */
import {crudRouter} from './shared';
import {collectionHandler} from './shared';
import * as Router from 'koa-router';

export const persistenceRouter = new Router();

persistenceRouter.use('/persistence/:collection', collectionHandler, crudRouter.routes(), crudRouter.allowedMethods());
