import * as express from 'express';
import * as session from 'express-session';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import path from 'path';
import { logger } from './logger';
import {
    StatusCodes,
} from 'http-status-codes';
import { auth_module } from './authentication';

export interface express_app_config {
    ip: string,
    port: number
}

export interface http_request_extra_data {
    current_username?: string
}

type http_method_callback = (
        req: Request<{}, any, any, ParsedQs, Record<string, any>>,
        res: Response<any, Record<string, any>, number>,
        extra_data: http_request_extra_data
    ) => Promise<void>

interface http_method_callbacks {
    [ path: string ]: http_method_callback
}

/**
 *
 *
 * @export
 * @class express_app
 */
export class express_app {
    public app: express.Express;
    private callbacks: {
        get: http_method_callbacks,
        put: http_method_callbacks,
        post: http_method_callbacks
    } = { get: {}, put: {}, post: {} };


    /**
     * Creates an instance of express_app.
     * @param {express_app_config} config
     */
    constructor (
        public config: express_app_config,
        public logger: logger,
        private auth?: auth_module,
    ) {
        this.app = express.default();
    }

    /**
     *
     *
     * @return {*}  {express_app}
     */
    init (): express_app {
        this.app.use(
            session.default( {
                secret: 'test',
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 3600 * 1000,
                },
            } ),
        );
        this.app.use( express.static( path.join( __dirname, '../mkp' ) ) );

        this.init_http_methods();

        this.init_basic_get();

        return this;
    }

    /**
     * Adds listener for epress's get, post, put methods, logs them and calls
     * proper callback if it exists
     *
     * @private
     */
    private init_http_methods () {
        this.app.get( '*', async ( req, res ) => {
            this.logger.http( req, res );
            const extra_data: http_request_extra_data = {
                current_username: this.auth?.get_username_by_cookie( req.headers.cookie ),
            };
            if ( this.callbacks.get[req.url] ) {
                await this.callbacks.get[req.url]( req, res, extra_data )
                    .catch( ( err ) => {
                        res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                        res.json( { error: err } );
                        res.end();
                    } );
            } else {
                res.status( StatusCodes.NOT_FOUND );
                res.json( { error: `No callback for path ${req.url}` } );
                res.end();
            }
        } );

        this.app.post( '*', async ( req, res ) => {
            this.logger.http( req, res );
            const extra_data: http_request_extra_data = {
                current_username: this.auth?.get_username_by_cookie( req.headers.cookie ),
            };
            if ( this.callbacks.post[req.url] ) {
                await this.callbacks.post[req.url]( req, res, extra_data )
                    .catch( ( err ) => {
                        res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                        res.json( { error: err } );
                        res.end();
                    } );
            } else {
                res.status( StatusCodes.NOT_FOUND );
                res.json( { error: `No callback for path "${req.url}"` } );
                res.end();
            }
        } );

        this.app.put( '*', async ( req, res ) => {
            this.logger.http( req, res );
            const extra_data: http_request_extra_data = {
                current_username: this.auth?.get_username_by_cookie( req.headers.cookie ),
            };
            if ( this.callbacks.put[req.url] ) {
                await this.callbacks.put[req.url]( req, res, extra_data )
                    .catch( ( err ) => {
                        res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                        res.json( { error: err } );
                        res.end();
                    } );
            } else {
                res.status( StatusCodes.NOT_FOUND );
                res.json( { error: `No callback for path ${req.url}` } );
                res.end();
            }
        } );
    }

    /**
     *
     *
     */
    init_basic_get () {
        this.on( 'get', '/dummy_test/one', async ( req, res ) => {
            this.logger.http( req, res );
            res.json( { data: 1 } );
            res.status( StatusCodes.OK );
            res.end();
        } );
    }


    /**
     *
     *
     * @param {function(): void} [callback]
     */
    async listen ( callback?: () => void ) {
        this.app.listen( this.config.port, this.config.ip, callback );
    }


    /**
     * Adds a callback for a specified combination of parh and method
     * For http request handels callback should call res.end() and prefereably set status code
     *
     * Only one callback per combination of ( method, path ) is allowed.
     * Replaces old one if called multiple times
     *
     * @param {('get' | 'post' | 'pur')} event
     * @param {string} path
     * @param {htpp_method_callback} callback
     */
    on ( event: 'get' | 'post' | 'put', path: string, callback: http_method_callback ) {
        switch ( event ) {
        case 'get':
            this.callbacks.get[path] = callback;
            break;
        case 'post':
            this.callbacks.post[path] = callback;
            break;
        case 'put':
            this.callbacks.put[path] = callback;
            break;
        default:
        }
    }

    /**
     * Removes a callback for a specified combination of parh and method
     *
     * @param {('get' | 'post' | 'pur')} event
     * @param {string} path
     */
    unsubscribe ( event: 'get' | 'post' | 'put', path: string ) {
        switch ( event ) {
        case 'get':
            delete this.callbacks.get[path];
            break;
        case 'post':
            delete this.callbacks.post[path];
            break;
        case 'put':
            delete this.callbacks.put[path];
            break;
        default:
        }
    }

    /**
     * Checks if specified ( method, path ) callback present
     *
     * @param {('get' | 'post' | 'put')} event
     * @param {string} path
     * @return {*}  {boolean}
     */
    has_callback ( event: 'get' | 'post' | 'put', path: string ): boolean {
        switch ( event ) {
        case 'get':
            return this.callbacks.get[path] !== undefined;
        case 'post':
            return this.callbacks.post[path] !== undefined;
        case 'put':
            return this.callbacks.put[path] !== undefined;
        default:
            return false;
        }
    }
}
