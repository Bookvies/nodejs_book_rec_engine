import * as axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../logger';
import { express_app } from '../server';
import { object_field_checker } from './helpers';


/**
 *
 *
 * @export
 * @class recommendation_page
 */
export class recommendation_page {
    /**
     * Creates an instance of recommendation_page.
     * @param {logger} logger
     */
    constructor (
        public logger: logger ) {

    }


    /**
     *
     *
     * @param {express_app} server
     */
    hook_def (
        server: express_app,
    ) {
        server.on( 'post', '/recommendations/books', async ( req, res ) => {
            const obj_matchg = object_field_checker( req.body, ['reviews'] );
            if ( !obj_matchg.ok ) {
                res.status( StatusCodes.BAD_REQUEST );
                res.json( {
                    error: `Expected ${obj_matchg.missing} in the request body`,
                } );
                res.end();
                return;
            }
            /*
            res.status( StatusCodes.OK );
            res.json( { books: [
                {
                    'index': 874,
                    'ISBN': '059035342X',
                    'Book-Title':
                        'Harry Potter and the Sorcerer\'s Stone (Harry Potter (Paperback))',
                    'Book-Author': 'J. K. Rowling',
                    'Image-URL-M': 'http://images.amazon.com/images/P/059035342X.01.MZZZZZZZ.jpg',
                    'Image-URL-S': 'http://images.amazon.com/images/P/059035342X.01.THUMBZZZ.jpg',
                },
                {
                    'index': 1389,
                    'ISBN': '0439136350',
                    'Book-Title': 'Harry Potter and the Prisoner of Azkaban (Book 3)',
                    'Book-Author': 'J. K. Rowling',
                    'Image-URL-M': 'http://images.amazon.com/images/P/0439136350.01.MZZZZZZZ.jpg',
                    'Image-URL-S': 'http://images.amazon.com/images/P/0439136350.01.THUMBZZZ.jpg',
                },
            ],
            } );
            res.end();
            return;
            */
            const data: { [title: string]: number } = {};
            // eslint-disable-next-line guard-for-in
            for ( const v in req.body.reviews ) {
                data[req.body.reviews[v]['Book-Title']] = req.body.reviews[v].rating;
            }
            await axios.default( {
                method: 'POST',
                url: '/recs/books',
                baseURL: '127.0.0.1',
                data: { reviews: req.body.reviews },
                timeout: 5000,
            } )
                .then( ( val ) => {
                    res.status( StatusCodes.OK );
                    res.json( {
                        books: val.data,
                    } );
                    res.end();
                    return;
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.message );
                        if ( err.response.status == 404 ) {
                            res.status( StatusCodes.BAD_GATEWAY );
                            res.json( {
                                error: `Recommendation engine gave 404`,
                            } );
                            res.end();
                            return;
                        } else if ( err.response.status == StatusCodes.INTERNAL_SERVER_ERROR ) {
                            res.status( StatusCodes.BAD_GATEWAY );
                            res.json( {
                                error: `Recommendation engine encountered 500`,
                            } );
                            res.end();
                            return;
                        }
                    } else if ( err.request ) {
                        res.status( StatusCodes.GATEWAY_TIMEOUT );
                        res.json( {
                            error: `Recommendation engine not responding`,
                        } );
                        res.end();
                        return;
                    } else {
                        res.status( StatusCodes.BAD_GATEWAY );
                        res.json( {
                            error: `Recommendation engine random error`,
                        } );
                        res.end();
                        return;
                    }
                } );
        } );
        this.logger.info( 'Connected' );
    }
}
