import { StatusCodes } from 'http-status-codes';
import { auth_module } from '../authentication';
import { logger } from '../logger';
import { express_app } from '../server';
import { object_field_checker } from './helpers';

/**
 * Provides http api for metods of auth module.
 * They are responisble for login, regitratiion and keeping track
 * of active users.
 *
 * @export
 * @class auth_page
 */
export class auth_page {
    /**
     * Creates an instance of auth_page.
     * @param {auth_module} auth
     * @param {logger} logger
     */
    constructor ( private auth: auth_module,
        public logger: logger ) {

    }

    /**
     *
     *
     * @param {express_app} server
     */
    hook_def ( server: express_app ) {
        server.on( 'get', '/auth/get_username', async ( req, res, extra_data ) => {
            res.status( StatusCodes.OK );
            res.json( { username: extra_data.current_username } );
            res.end();
        } );

        server.on( 'post', '/auth/register', async ( req, res ) => {
            const obj_matchg = object_field_checker( req.body, ['password_hash', 'username'] );
            if ( !obj_matchg.ok ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: `Expected ${obj_matchg.missing} in the request body`,
                } );
                res.end();
                return;
            }
            if ( req.headers.cookie == undefined ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: 'Cookie is undefined',
                } );
                res.end();
                return;
            }
            await this.auth.register(
                req.headers.cookie, req.body.username, req.body.password_hash )
                .then( ( val ) => {
                    if ( val.succ ) {
                        res.status( StatusCodes.CREATED );
                        res.json( {
                            username: this.auth.get_username_by_cookie( req.headers.cookie ),
                        } );
                        res.end();
                        return;
                    } else {
                        res.status( StatusCodes.UNAUTHORIZED );
                        res.json( {
                            reason: val.description,
                        } );
                        res.end();
                        return;
                    }
                } )
                .catch( ( err ) => {
                    res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                    res.json( {
                        error: err,
                    } );
                    res.end();
                    return;
                } );
        } );

        server.on( 'post', '/auth/login', async ( req, res ) => {
            const obj_matchg = object_field_checker( req.body, ['password_hash', 'username'] );
            if ( !obj_matchg.ok ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: `Expected ${obj_matchg.missing} in the request body`,
                } );
                res.end();
                return;
            }
            if ( req.headers.cookie == undefined ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: 'Cookie is undefined',
                } );
                res.end();
                return;
            }
            await this.auth.login( req.headers.cookie, req.body.username, req.body.password_hash )
                .then( ( val ) => {
                    if ( val.succ ) {
                        res.status( StatusCodes.OK );
                        res.json( {
                            username: this.auth.get_username_by_cookie( req.headers.cookie ),
                        } );
                        res.end();
                        return;
                    } else {
                        res.status( StatusCodes.UNAUTHORIZED );
                        res.json( {
                            reason: val.description,
                        } );
                        res.end();
                        return;
                    }
                } )
                .catch( ( err ) => {
                    res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                    res.json( {
                        error: err,
                    } );
                    res.end();
                    return;
                } );
        } );

        server.on( 'post', '/auth/exit', async ( req, res ) => {
            if ( req.headers.cookie == undefined ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: 'Cookie is undefined',
                } );
                res.end();
                return;
            }
            const result = this.auth.exit( req.headers.cookie );
            if ( result.succ == true ) {
                res.status( StatusCodes.OK );
                res.end();
                return;
            } else {
                res.status( StatusCodes.UNAUTHORIZED );
                res.json( {
                    reason: result.description,
                } );
                res.end();
                return;
            }
        } );

        server.on( 'post', '/auth/user_exists', async ( req, res ) => {
            const obj_matchg = object_field_checker( req.body, ['username'] );
            if ( !obj_matchg.ok ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: `Expected ${obj_matchg.missing} in the request body`,
                } );
                res.end();
                return;
            }
            await this.auth.user_exists( req.body.username )
                .then( ( val ) => {
                    res.status( StatusCodes.OK );
                    res.json( { result: val } );
                    res.end();
                    return;
                } )
                .catch( ( err ) => {
                    res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                    res.json( {
                        error: err,
                    } );
                    res.end();
                    return;
                } );
        } );
    }
}
