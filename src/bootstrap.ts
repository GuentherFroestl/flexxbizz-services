/**
 * Created by gfr on 06.01.17.
 */
import {KoaApp} from './rest/rest-service';
const minimist = require('minimist');
const mongoUrl = 'mongodb://@localhost/test?auto_reconnect=true';


function start(): void {
    let argv = minimist(process.argv.slice(2));
    let port = argv.port || argv.p || 3000;
    let dbUrl = argv.dburl || argv.db || mongoUrl;

    let app = new KoaApp(port);
    app.listen();
}

start();