import { StatusCodes } from 'http-status-codes';
import { auth_module } from '../authentication';
import { logger } from '../logger';
import { express_app } from '../server';
import { object_field_checker } from './helpers';

// NOT YET FINISHED
// REQUIERS TESTS

/**
 *
 *
 * @export
 * @class auth_page
 */
export class auth_page {
    /**
     * Creates an instance of auth_page.
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
            res.json( { username: extra_data.current_username } );
            res.status( StatusCodes.OK );
            res.end();
        } );

        // requiers docs
        server.on( 'get', '/auth/register', async ( req, res ) => {
            const obj_matchg = object_field_checker( req.body, ['password_hash', 'username'] );
            if ( !obj_matchg.ok ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: `Expected both ${obj_matchg.missing} in the request body`,
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
            this.auth.register( req.headers.cookie, req.body.username, req.body.password_hash )
                .then( ( val ) => {
                    if ( val.succ ) {
                        res.json( {
                            username: this.auth.get_username_by_cookie( req.headers.cookie ),
                        } );
                        res.status( StatusCodes.CREATED );
                        res.end();
                        return;
                    } else {
                        res.json( {
                            reason: val.description,
                        } );
                        res.status( StatusCodes.UNAUTHORIZED );
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
    }
}
