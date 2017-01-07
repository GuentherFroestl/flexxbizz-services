/**
 * Created by gfr on 06.01.17.
 */
import {crudRouter} from './shared';
import { collectionHandler} from './shared';

export const persistenceRouter = require('koa-router')();

persistenceRouter.use('/persistence/:collection', collectionHandler, crudRouter.routes(), crudRouter.allowedMethods());
