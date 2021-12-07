import * as server from './server';
import { global_logger, logger } from './logger';
import { database, database_config } from './database';

let server_config: server.express_app_config;

if ( process.env.ON_HEROKU ) {
    server_config = {
        ip: '0.0.0.0',
        port: parseInt( process.env.PORT || '80' ),
    };
} else {
    server_config = {
        ip: '127.0.0.1',
        port: parseInt( process.env.PORT || '8080' ),
    };
}


/**
 *
 *
 */
function init () {
    const database_config: database_config = {
        address: 'mongodb://localhost:27017',
        db_name: 'testing',
    };
    const db_client = new database(
        database_config,
        new logger(
            { debug: true,
                info: true,
                warn: true,
                error: true,
                prefix: 'DB',
            } ) );

    db_client.connect().then( () => {
        // for testing
        db_client.testing_inserion().then( async () => {
            console.log( 'For testing: should contain one element { a: 3 }:\n\t',
                await db_client.testing_find(),
            );
            await db_client.testing_delete();
            console.log( 'For testing: should be empty:\n\t',
                await db_client.testing_find(),
            );
        } );
    } );


    global_logger.info( 'Application started' );
    const s = new server.express_app( server_config );
    s.init().listen( () => {
        global_logger.info( `Application listening on: ${server_config}` );
    } );
}

init();
