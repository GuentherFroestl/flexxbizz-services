/**
 * Created by gfr on 06.01.17.
 */
import {KoaApp} from './rest/koa-app';
import {MongoDbHandler} from './persistence/mongo'
const minimist = require('minimist');
const MONGO_URL = 'mongodb://@localhost/test?auto_reconnect=true';
const PORT= 3000;

/**
 * parse call arguments and provide application with dependencies and start listening.
 */
function start(): void {
    let argv = minimist(process.argv.slice(2));
    let port = argv.p || PORT;
    let dbUrl = argv.d || MONGO_URL;
    console.info(`port:${port.toString()}`);
    console.info(`dburl:${dbUrl}`);


    let mongoDb = new MongoDbHandler(dbUrl);
    console.info(`MongoDB used on :${dbUrl}`);
    let app = new KoaApp(port,mongoDb);
    app.listen();
}
/**
 * bootstrap.
 */
start();