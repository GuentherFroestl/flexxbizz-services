/**
 * Created by gfr on 05.01.17.
 */
const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('koa-router')();

import {exceptionHandler} from '../exception-handling';
import {loggingHandler} from '../logging';
import {persistenceRouter} from '../persistence';


export class KoaApp {

    app: any;

    /**
     * Construct app with some parameters supplied.
     * @param port
     */
    constructor(private port: number = 3000) {
        this.app = new Koa();

        router
            .get('/', function (ctx, next) {
                ctx.body = 'Hello World!';
            })
            .get('/error', function (ctx, next) {
                throw Error('Error handling works!');
            })
            .get('/users', function (ctx, next) {
                ctx.body = 'Hello Users!';
            })
            .get('/async', async(ctx, next) => {
                ctx.body = 'Hello async op!';
            })
            .post('/users', koaBody, function (ctx, next) {
                console.log(ctx.request.body);
                // ...
            })
            .put('/users/:id', koaBody, function (ctx, next) {
                console.log(ctx.request.body);
                // ...
            })
            .del('/users/:id', function (ctx, next) {
                // ...
            });

        this.app
            .use(loggingHandler)
            .use(exceptionHandler)
            .use(persistenceRouter.routes())
            .use(router.routes())
            .use(router.allowedMethods());
    }

    listen = () => {
        this.app.listen(this.port, () => {
            console.info(`REST Service started on http://localhost:${this.port}`)
        });
    };
}

