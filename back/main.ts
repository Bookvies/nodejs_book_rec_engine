import * as server from './server';
import { global_logger, logger } from './logger';
import { database, database_config } from './database';
import { auth_module, auth_module_config } from './authentication';


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
        // address: 'mongodb://root:example@127.0.0.1:27017/',
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

    const auth_config: auth_module_config = {
        MS_PER_TTL_TICK: 1000,
        NEW_TTL_ON_ACTION: 3600,
        NEW_TTL_ON_LOGIN: 3600,
    };
    const auth = new auth_module(
        auth_config,
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
