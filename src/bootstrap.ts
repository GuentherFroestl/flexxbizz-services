/**
 * Created by gfr on 06.01.17.
 */
import {KoaApp} from './rest/rest-service';
import {MongoDbHandler} from './persistence/mongo'
const minimist = require('minimist');
const mongoUrl = 'mongodb://@localhost/test?auto_reconnect=true';

/**
 * parse call arguments and provide application with dependencies and start listening.
 */
function start(): void {
    let argv = minimist(process.argv.slice(2));
    let port = argv.port || argv.p || 3000;
    let dbUrl = argv.dburl || argv.db || mongoUrl;

    let mongoDb = new MongoDbHandler(dbUrl);
    let app = new KoaApp(port,mongoDb);
    app.listen();
}
/**
 * bootstrap.
 */
start();