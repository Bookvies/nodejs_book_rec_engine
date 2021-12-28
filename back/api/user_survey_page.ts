import { StatusCodes } from 'http-status-codes';
import { database, DATABASE_ERROR_CODES } from '../database';
import { logger } from '../logger';
import { express_app } from '../server';
import { object_field_checker } from './helpers';


/**
 *
 *
 * @export
 * @class user_survey_page
 */
export class user_survey_page {
    /**
     * Creates an instance of user_survey_page.
     * @param {logger} logger
     */
    constructor (
        public logger: logger ) {

    }


    /**
     *
     *
     * @param {express_app} server
     * @param {database} database
     */
    hook_def (
        server: express_app,
        database: database,
    ) {
        server.on( 'post', '/survey/books/reviews', async ( req, res, extra_data ) => {
            const obj_matchg = object_field_checker( req.body, ['username'] );
            if ( !obj_matchg.ok ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: `Expected ${obj_matchg.missing} in the request body`,
                } );
                res.end();
                return;
            }
            if ( req.body.reviews == undefined ) {
                await database.retrieve_book_reviews( req.body.username )
                    .then( ( val ) => {
                        res.status( StatusCodes.OK );
                        res.json( { reviews: val.reviews } );
                        res.end();
                    } )
                    .catch( ( err ) => {
                        if ( err.code == DATABASE_ERROR_CODES.NOT_FOUND &&
                                err.origin == 'database' ) {
                            res.status( StatusCodes.OK );
                            res.json( { reviews: {} } );
                            res.end();
                        } else {
                            res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                            res.json( {
                                error: err,
                            } );
                            res.end();
                        }
                    } );
            } else {
                if ( req.body.username != extra_data.current_username ) {
                    res.status( StatusCodes.UNAUTHORIZED );
                    res.json( {
                        reason: `Request and auth username doesnt match`,
                    } );
                    res.end();
                    return;
                }
                database.add_book_reviews_for_user(
                    req.body.username,
                    req.body.reviews,
                )
                    .then( () => {
                        res.status( StatusCodes.CREATED );
                        res.end();
                    } )
                    .catch( ( err ) => {
                        res.status( StatusCodes.INTERNAL_SERVER_ERROR );
                        res.json( {
                            error: err,
                        } );
                        res.end();
                    } );
            }
        } );
    }
}
