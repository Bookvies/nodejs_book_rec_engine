import { IncomingMessage, ServerResponse } from 'http';
import * as p from 'pino';
import * as p_http from 'pino-http';

const pino = p.default( {
    level: 'debug',
    transport: {
        target: 'pino-pretty',
    },
} );
const pino_http = p_http.default( {
    logger: pino,
    useLevel: 'debug',
    transport: {
        target: 'pino-pretty',
    },
} );

export interface logger_config {
    debug: boolean,
    info: boolean,
    warn: boolean,
    error: boolean,
    prefix: string
}

/**
 *
 *
 * @export
 * @class logger
 */
export class logger {
    /**
     * Creates an instance of logger.
     * @param {logger_config} config
     * @memberof logger
     */
    constructor ( public config: logger_config ) {
    }

    /**
     * Log argument to debug stream using pino if debug set to true in config
     * Adds prefix to argument. Final message will be "PREFIX: ARG"
     * @param {string} arg
     * @memberof logger
     */
    debug ( arg: string ) {
        if ( this.config.debug ) pino.debug( `${this.config.prefix}: ${arg}` );
    }

    /**
     * Log argument to info stream using pino if info set to true in config
     * Adds prefix to argument. Final message will be "PREFIX: ARG"
     * @param {string} arg
     * @memberof logger
     */
    info ( arg: string ) {
        if ( this.config.info ) pino.info( `${this.config.prefix}: ${arg}` );
    }

    /**
     * Log argument to warn stream using pino if warn set to true in config
     * Adds prefix to argument. Final message will be "PREFIX: ARG"
     * @param {string} arg
     * @memberof logger
     */
    warn ( arg: string ) {
        if ( this.config.warn ) pino.warn( `${this.config.prefix}: ${arg}` );
    }

    /**
     * Log argument to error stream using pino if error set to true in config
     * Adds prefix to argument. Final message will be "PREFIX: ARG"
     * @param {string} arg
     * @memberof logger
     */
    error ( arg: string ) {
        if ( this.config.error ) pino.error( `${this.config.prefix}: ${arg}` );
    }


    /**
     *   Log incoming http request
     *   Adds prefix and msg to first message
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {string} [msg]
     */
    http ( req: IncomingMessage, res: ServerResponse, msg?: string ) {
        if ( this.config.debug ) {
            pino_http( req, res );
            ( req as any ).log.info( `${this.config.prefix}: ${msg === undefined ? '' : msg}` );
        }
    }
}

export const global_logger = new logger( {
    debug: true,
    info: true,
    warn: true,
    error: true,
    prefix: 'GLOBAL',
} );
