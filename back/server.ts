import * as express from 'express';
import path from 'path';
import * as mongodb from 'mongodb';

const mongo_client = new mongodb.MongoClient( 'mongodb://localhost:27017' );
/**
 *
 *
 */
async function run () {
    await mongo_client.connect()
        .then( ( cliet ) => {
            console.log( 'db connected' );
        } )
        .catch( console.log );


    const db = mongo_client.db( 'testing' );
    const collection = db.collection( 'http' );

    collection.insertOne( { header: { a: 1 }, body: { d: 3 } } )
        .then( () => {
            console.log( 'inserted temp data' );
        } )
        .catch( console.log );
}

run();

export interface express_app_config {
    ip: string,
    port: number
}

/**
 *
 *
 * @export
 * @class express_app
 */
export class express_app {
    public app: express.Express;


    /**
     * Creates an instance of express_app.
     * @param {express_app_config} config
     */
    constructor ( public config: express_app_config ) {
        this.app = express.default();
    }

    /**
     *
     *
     * @return {*}  {express_app}
     */
    init (): express_app {
        this.app.use( express.json() );
        this.app.use( express.static( path.join( __dirname, '../mkp' ) ) );

        this.init_basic_get();

        return this;
    }

    /**
     *
     *
     */
    init_basic_get () {
        this.app.get( '/', ( req, res ) => {
            console.log( 'Got / get request' );
            res.sendFile( path.join( __dirname, '../mkp/index.html' ) );
            res.end();
        } );

        this.app.get( '/dummy_test/one', ( req, res ) => {
            console.log( 'Got / get request' );
            res.json( { data: 1 } );
            res.end();
        } );
    }


    /**
     *
     *
     * @param {function(): void} [callback]
     */
    listen ( callback?: () => void ) {
        this.app.listen( this.config.port, this.config.ip, callback );
    }
}
