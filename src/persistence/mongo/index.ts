/**
 * Created by gfr on 06.01.17.
 */
const MongoClient = require('mongodb').MongoClient;

/**
 * Provider for MongoClient Connection.
 */
export class MongoDbConnection {

    private connection;

    constructor(private dbUrl: string) {
    }

    /**
     * Will put the connection into ctx.dbConnection.
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    connect = async(ctx, next) => {
        if (!this.connection) {
            this.connection = await MongoClient.connect(this.dbUrl);
        }
        ctx.dbConnection = this.connection;
    };
}
