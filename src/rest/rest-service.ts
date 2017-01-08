/**
 * Created by gfr on 05.01.17.
 */
const Koa = require('koa');
const mainRouter = require('koa-router')();
import {PersistenceHandler, addDbHandlerToCtx} from "../persistence/shared/index";
import {exceptionHandler} from '../exception-handling';
import {loggingHandler} from '../logging';
import {persistenceRouter} from '../persistence';



export class KoaApp {

    app: any;

    /**
     * Construct app with some parameters supplied.
     * @param port
     */
    constructor(private port: number = 3000, dbHandler: PersistenceHandler) {
        this.app = new Koa();

        mainRouter
            .get('/', function (ctx, next) {
                ctx.body = 'Hello World!';
            })
            .get('/error', function (ctx, next) {
                throw Error('Error handling works!');
            });

        this.app
            .use(loggingHandler)
            .use(exceptionHandler)
            .use(addDbHandlerToCtx(dbHandler))
            .use(persistenceRouter.routes())
            .use(mainRouter.routes())
            .use(mainRouter.allowedMethods());
    }

    listen = () => {
        this.app.listen(this.port, () => {
            console.info(`REST Service started on http://localhost:${this.port}`)
        });
    };
}

