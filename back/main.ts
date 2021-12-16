import * as server from './server';
import { global_logger, logger } from './logger';
import { database, database_config } from './database';
import { auth_module } from './authentication';

let server_config: server.express_app_config;
let db_config: database_config;
let db_client: database;
let s: server.express_app;

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
    db_config = {
        address: 'mongodb://localhost:27017',
        db_name: 'testing',
    };
    db_client = new database(
        db_config,
        new logger(
            { debug: true,
                info: true,
                warn: true,
                error: true,
                prefix: 'DB',
            } ) );

    db_client.connect()
        .catch( ( err ) => {
            global_logger.error( err );
        } );

    const auth = new auth_module(
        db_client,
        new logger( {
            debug: true,
            info: true,
            warn: true,
            error: true,
            prefix: 'AUTH_MODULE',
        } ) );

    global_logger.info( 'Application started' );
    s = new server.express_app(
        server_config,
        new logger( {
            debug: true,
            info: true,
            warn: true,
            error: true,
            prefix: 'SERVER',
        } ),
        auth,
    );
    s.init().listen( () => {
        global_logger.info( `Application listening on: ${JSON.stringify( server_config )}` );
    } );
}

init();
