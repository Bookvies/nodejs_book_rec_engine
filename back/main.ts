import * as server from './server';
import { global_logger } from './logger';

global_logger.info( 'Application started' );
const s = new server.express_app( { ip: '127.0.0.1', port: 8080 } );
s.init().listen();
