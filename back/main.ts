import * as server from './server';
import { global_logger } from './logger';

let server_config: server.express_app_config;

if ( process.env.ON_HEROKU ) {
    server_config = {
        ip: "0.0.0.0",
        port: parseInt(process.env.PORT || "80"),
    }
} else {
    server_config = {
        ip: "127.0.0.1",
        port: parseInt(process.env.PORT || "8080"),
    }
}

global_logger.info( 'Application started' );
const s = new server.express_app( server_config );
s.init().listen( () => {
    global_logger.info( `Application listening on: ${server_config}` );
} );
