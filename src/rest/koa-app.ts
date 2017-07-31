/**
 * Created by gfr on 05.01.17.
 */
import * as Koa from'koa';
import * as Router from 'koa-router';
import {PersistenceHandler, addDbHandlerToCtx} from "../persistence/shared/index";
import {exceptionHandler} from '../exception-handling';
import {loggingHandler} from '../logging';
import {persistenceRouter} from '../persistence';
import {Server} from "http";

const mainRouter = new Router();


export class KoaApp {

    app: Koa;
    service: Server;

    /**
     * Construct app with some parameters supplied.
     * @param port
     */
    constructor(private port: number = 3000, private dbHandler: PersistenceHandler) {
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
        this.service=this.app.listen(this.port, () => {
            console.info(`REST Service started on http://localhost:${this.port}`)
        });
    };
    close = () =>{
        if (this.service){
        this.service.close();
        }
    }
}

