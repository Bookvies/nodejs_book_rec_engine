import * as mongodb from 'mongodb';
import { logger } from './logger';

export enum DATABASE_ERROR_CODES {
    ALREADY_PRESENT,
    NOT_FOUND
}

export interface database_config {
    address: string,
    db_name: string
}

/**
 * Class to simplify work with mongo database
 *
 * @export
 * @class database
 */
export class database {
    mongo_client: mongodb.MongoClient;
    db: mongodb.Db | undefined;
    user_collection: mongodb.Collection<mongodb.Document> | undefined;

    ping_timeout: NodeJS.Timeout | undefined;

    /**
     * Creates an instance of database.
     * @param {database_config} config
     */
    constructor (
        private config: database_config,
        public logger: logger,
    ) {
        this.mongo_client = new mongodb.MongoClient( config.address );
    }

    /**
     * Connects to mongo database and initializes collection 'user'
     *
     */
    async connect () {
        if ( this.ping_timeout == undefined ) {
            this.ping_timeout = setTimeout( this.ping.bind( this ), 1000 );
        }
        await this.mongo_client.connect()
            .then( ( ) => {
                this.db = this.mongo_client.db( this.config.db_name );

                this.user_collection = this.db.collection( 'user' );

                this.logger.info( 'Client connected' );
            } )
            .catch( ( err ) => {
                this.logger.error( err );
            } );
    }


    /**
     *
     *
     * @return {*}
     */
    disconnect () {
        if ( this.ping_timeout != undefined ) {
            clearTimeout( this.ping_timeout );
        }
        this.ping_timeout = undefined;

        return this.mongo_client.close();
    }

    /**
     * Pings database once a second and tries to reconnect if it failes
     *
     */
    ping () {
        if ( this.ping_timeout != undefined ) {
            clearTimeout( this.ping_timeout );
        }
        this.ping_timeout = setTimeout( this.ping.bind( this ), 1000 );
        if ( this.db == undefined ) {
            this.connect();
            return;
        }
        this.db.command( { ping: 1 } )
            .then( () => {
                this.logger.debug( 'Ping successful' );
            } )
            .catch( () => {
                this.logger.warn( 'Ping failed' );
                this.mongo_client.close().catch( ( err ) => {
                    this.logger.error( `Disconnect in ping error ${ err }` );
                } );
                this.connect();
            } );
    }

    /**
     * !!! TO BE IMPLEMENTED
     * Returns username and passwd hash if username in database,
     * throws error NOT_FOUND from enumotherwise
     *
     * Probably should check if db inited before req.
     * In case of db error... dunno. Throws error as well
     *
     * @param {string} username
     * @return {*}  {{ username: string, passwd_hash: strig }}
     */
    async retrieve_user_passwd ( username: string ):
    Promise<{ username: string; passwd_hash: any; }> {
        throw DATABASE_ERROR_CODES.NOT_FOUND;
        // to silence may be unused
        return { username: username, passwd_hash: 'PLACEHOLDER' };
    }


    /**
     * Adds password hash for a user
     * If user already in database, throws
     * ALREADY_PRESENT enum;
     *
     * Probably should check if db inited before req.
     * In case of db error... dunno. Throws error as well
     *
     * @param {string} username
     * @param {string} passwd_hash
     * @return {*}  {Promise<void>}
     */
    async add_passwd_for_user ( username: string, passwd_hash: string ): Promise<void> {
        throw DATABASE_ERROR_CODES.ALREADY_PRESENT;
        // to silence may be unused
        username; passwd_hash;
    }

    /**
     * Inserting one elemet { a: 3 } to user collection
     *
     */
    async testing_inserion () {
        if ( this.user_collection == undefined ) {
            throw new Error( 'Collection is undefined' );
        }
        await this.user_collection.insertOne( { a: 3 } )
            .catch( ( err ) => {
                throw err;
            } ); ;
    }

    /**
     * Get all elements from user collection
     *
     */
    async testing_find () {
        if ( this.user_collection == undefined ) {
            throw new Error( 'Collection is undefined' );
        }
        const ret: Array<any> = [];
        await this.user_collection.find( { } ).forEach( ( elem ) => {
            ret.push( elem );
        } );
        return ret;
    }

    /**
     * Deletes element { a: 3 } from user collection
     *
     */
    async testing_delete () {
        if ( this.user_collection == undefined ) {
            throw new Error( 'Collection is undefined' );
        }
        await this.user_collection.findOneAndDelete( { a: 3 } )
            .catch( ( err ) => {
                throw err;
            } );
    }
}
