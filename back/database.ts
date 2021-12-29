import * as mongodb from 'mongodb';
import { logger } from './logger';

export interface DATABASE_ERROR {
    code: DATABASE_ERROR_CODES,
    description: string,
    origin: string
}

export enum DATABASE_ERROR_CODES {
    DB_UNDEFINED,
    COLLECTION_UNDEFINED,
    ALREADY_PRESENT,
    NOT_FOUND
}

const common_errors: {
    DB_UNDEFINED: DATABASE_ERROR,
    COLLECTION_UNDEFINED: DATABASE_ERROR,
    ALREADY_PRESENT: DATABASE_ERROR,
    NOT_FOUND: DATABASE_ERROR,
    [key: string]: DATABASE_ERROR,
} = {
    'DB_UNDEFINED': {
        code: DATABASE_ERROR_CODES.DB_UNDEFINED,
        description: 'Database is undefined',
        origin: 'database',
    },
    'COLLECTION_UNDEFINED': {
        code: DATABASE_ERROR_CODES.COLLECTION_UNDEFINED,
        description: 'Collection is undefined',
        origin: 'database',
    },
    'ALREADY_PRESENT': {
        code: DATABASE_ERROR_CODES.ALREADY_PRESENT,
        description: 'Indexes of your object you trying to insert already present',
        origin: 'database',
    },
    'NOT_FOUND': {
        code: DATABASE_ERROR_CODES.NOT_FOUND,
        description: 'No objects matching your query',
        origin: 'database',
    },
};

export interface database_config {
    address: string,
    db_name: string
}

export interface user_doc {
    username: string,
    passwd_hash: string
}

export interface book_reviews {
    [ISBN: string]: {
        rating: number,
        'Book-Title': string,
    }
}

export interface book_reviews_doc {
    username: string,
    reviews: book_reviews
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
    user_collection: mongodb.Collection<user_doc> | undefined;
    book_reviews_collection: mongodb.Collection<book_reviews_doc> | undefined;

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
            .then( async ( ) => {
                this.db = this.mongo_client.db( this.config.db_name );

                await this.define_user_collection();
                await this.define_book_reviews_collection();

                this.logger.info( 'Client connected' );
            } )
            .catch( ( err ) => {
                this.logger.error( err );
            } );
    }

    /**
     * Creates user collection according to the schema if
     * there isnt one already
     *
     */
    async define_user_collection () {
        if ( this.db == undefined ) {
            throw common_errors.DB_UNDEFINED;
        }

        await this.db.listCollections(
            { name: 'user' },
        ).toArray().then( ( val ) => {
            if ( val.length > 0 ) {
                this.user_collection = this.db?.collection( 'user' );
            }
        } );
        if ( this.user_collection == undefined ) {
            this.user_collection = await this.db?.createCollection<user_doc>( 'user', {
                validationLevel: 'strict',
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['username', 'passwd_hash'],
                        properties: {
                            username: {
                                bsonType: 'string',
                                description: 'must be a string and is required',
                            },
                            passwd_hash: {
                                bsonType: 'string',
                                description: 'must be a string and is required',
                            },
                        },
                    },
                },
            } ).
                then( async ( collection ) => {
                    await collection.createIndex(
                        {
                            username: 1,
                        },
                        {
                            unique: true,
                        },
                    );
                    return collection;
                } );
        }
    }

    /**
     * Creates user collection according to the schema if
     * there isnt one already
     *
     */
    async define_book_reviews_collection () {
        if ( this.db == undefined ) {
            throw common_errors.DB_UNDEFINED;
        }

        await this.db.listCollections(
            { name: 'book_reviews' },
        ).toArray().then( ( val ) => {
            if ( val.length > 0 ) {
                this.book_reviews_collection = this.db?.collection( 'book_reviews' );
            }
        } );
        if ( this.book_reviews_collection == undefined ) {
            this.book_reviews_collection =
                await this.db?.createCollection<book_reviews_doc>( 'book_reviews', {
                    validationLevel: 'strict',
                    validator: {
                        $jsonSchema: {
                            bsonType: 'object',
                            required: ['username', 'reviews'],
                            properties: {
                                username: {
                                    bsonType: 'string',
                                    description: 'must be a string and is required',
                                },
                                reviews: {
                                    bsonType: 'object',
                                    description: 'must be a string and is required',
                                },
                            },
                        },
                    },
                } ).
                    then( async ( collection ) => {
                        await collection.createIndex(
                            {
                                username: 1,
                            },
                            {
                                unique: true,
                            },
                        );
                        return collection;
                    } );
        }
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
     * Returns username and passwd hash if username in database,
     * throws error NOT_FOUND from error otherwise
     *.
     * In case of db error transimts it
     *
     * @param {string} username
     * @return {*}  {{ username: string, passwd_hash: strig }}
     */
    async retrieve_user_passwd ( username: string ):
    Promise<user_doc> {
        if ( this.user_collection == undefined ) {
            this.logger.warn( `User collection undef for '${username}'` );
            throw common_errors.COLLECTION_UNDEFINED;
        }
        const ret = await this.user_collection.find( { username: username } ).toArray();
        if ( ret.length == 0 ) {
            this.logger.warn( `User not found for '${username}'` );
            throw common_errors.NOT_FOUND;
        }
        this.logger.info( `User found ${JSON.stringify( ret[0] )}` );
        return {
            username: ret[0].username,
            passwd_hash: ret[0].passwd_hash,
        };
    }


    /**
     * Adds password hash for a user
     * If user already in database, throws
     * ALREADY_PRESENT error;
     *
     * In case of db error transimts it
     *
     * @param {string} username
     * @param {string} passwd_hash
     * @return {*}  {Promise<void>}
     */
    async add_passwd_for_user ( username: string, passwd_hash: string ): Promise<void> {
        if ( this.user_collection == undefined ) {
            this.logger.warn( `User collection undef for '${username}'` );
            throw common_errors.COLLECTION_UNDEFINED;
        }
        return this.user_collection.insertOne(
            {
                username: username,
                passwd_hash: passwd_hash,
            } )
            .then( ( ) => {
                return;
            } ).catch( ( err ) => {
                if ( err.code == 11000 ) {
                    throw common_errors.ALREADY_PRESENT;
                } else {
                    throw err;
                }
            } );
    }

    /**
     * Returns username and reviews if username in database,
     * throws error NOT_FOUND from error otherwise
     *.
     * In case of db error transimts it
     *
     * @param {string} username
     * @return {*}  {Promise<mongodb.WithId<user_doc>>}
     */
    async retrieve_book_reviews ( username: string ):
    Promise<book_reviews_doc> {
        if ( this.book_reviews_collection == undefined ) {
            this.logger.warn( `Book reviews collection undef for '${username}'` );
            throw common_errors.COLLECTION_UNDEFINED;
        }
        const ret = await this.book_reviews_collection.find( { username: username } ).toArray();
        if ( ret.length == 0 ) {
            this.logger.warn( `Book reviews not found for '${username}'` );
            throw common_errors.NOT_FOUND;
        }
        this.logger.info( `Book reviews found ${JSON.stringify( ret[0] )}` );
        return {
            username: ret[0].username,
            reviews: ret[0].reviews,
        };
    }

    /**
     * Adds or replaces book_reviews for a user
     *
     * In case of db error transimts it
     *
     * @param {string} username
     * @param {book_reviews} reviews
     * @return {*}  {Promise<void>}
     */
    async add_book_reviews_for_user ( username: string, reviews: book_reviews ): Promise<void> {
        if ( this.book_reviews_collection == undefined ) {
            this.logger.warn( `Book reviews collection undef for '${username}'` );
            throw common_errors.COLLECTION_UNDEFINED;
        }
        return this.book_reviews_collection.updateOne(
            {
                username: username,
            },
            { $set: {
                username: username,
                reviews: reviews,
            } },
            {
                upsert: true,
            } )
            .then( ( ) => {
                return;
            } ).catch( ( err ) => {
                throw err;
            } );
    }
}
