import * as server from './server';
import { global_logger, logger } from './logger';
import { database, database_config } from './database';
import { auth_module, auth_module_config } from './authentication';
import { auth_page } from './api/user_auth';
import { user_survey_page } from './api/user_survey_page';
import { recommendation_page } from './api/recommendation_page';


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
        ip: '0.0.0.0',
        port: parseInt( process.env.PORT || '8080' ),
    };
}


/**
 *
 *
 */
function init () {
    if ( process.env.ON_HEROKU ) {
        db_config = {
            // eslint-disable-next-line max-len
            address: 'mongodb+srv://heroku:heroku@cluster0.pd05q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            db_name: 'heroku',
        };
    } else {
        db_config = {
            // address: process.env.MONGO_URL || 'mongodb://root:example@127.0.0.1:27017/',
            address: process.env.MONGO_URL || 'mongodb://localhost:27017',
            db_name: process.env.MONGO_DB_NAME || 'testing',
        };
    }
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

    const auth_api = new auth_page(
        auth,
        new logger( {
            debug: true,
            info: true,
            warn: true,
            error: true,
            prefix: 'AUTH_API',
        } ),
    );
    auth_api.hook_def( s );

    const survey_api = new user_survey_page(
        new logger( {
            debug: true,
            info: true,
            warn: true,
            error: true,
            prefix: 'SURVEY_API',
        } ),
    );
    survey_api.hook_def( s, db_client );

    const recoomendation_api = new recommendation_page(
        new logger( {
            debug: true,
            info: true,
            warn: true,
            error: true,
            prefix: 'RECOMMENDATION_API',
        } ),
    );
    recoomendation_api.hook_def( s );


    s.init().listen( () => {
        global_logger.info( `Application listening on: ${JSON.stringify( server_config )}` );
    } );
}

init();
