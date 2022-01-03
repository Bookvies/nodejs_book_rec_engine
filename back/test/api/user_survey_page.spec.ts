import { auth_page } from '../../api/user_auth';
import { user_survey_page } from '../../api/user_survey_page';
import { auth_module, auth_module_config } from '../../authentication';
import { logger } from '../../logger';
import { express_app } from '../../server';
import { integration_helpers } from '../helpers/integration-helpers';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';

describe( 'server events', () => {
    const instance = new integration_helpers( {
        server_port: 0,
        db_name: 'user_survey_spec',
    } );
    let server: express_app;
    let auth: auth_module;
    const auth_config: auth_module_config = {
        MS_PER_TTL_TICK: 400,
        NEW_TTL_ON_ACTION: 3,
        NEW_TTL_ON_LOGIN: 3,
    };
    let auth_api: auth_page;


    beforeAll( async () => {
        const db = await instance.get_database();
        await db.connect();
        await db.user_collection?.deleteMany( {} );
        await db.book_reviews_collection?.deleteMany( {} );
        auth = new auth_module(
            auth_config,
            db,
            new logger( {
                debug: false,
                info: false,
                warn: false,
                error: false,
                prefix: 'USER_AUTH_SPEC',
            } ) );
        server = await instance.get_server( auth );
        auth_api = new auth_page( auth,
            new logger( {
                debug: false,
                info: false,
                warn: false,
                error: false,
                prefix: 'USER_AUTH_PAGE_SPEC',
            } ) );
        auth_api.hook_def( server );
        const survey_api = new user_survey_page(
            new logger( {
                debug: false,
                info: false,
                warn: false,
                error: false,
                prefix: 'SURVEY_API',
            } ),
        );
        survey_api.hook_def( server, db );
    } );

    it( 'should be empty object for undefined user 0', async () => {
        const ti = 0;
        await request.default( server.app )
            .post( '/survey/books/reviews' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
            } )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.reviews ).toStrictEqual( {} );
            } );
    } );

    it( 'should not set without cookie 1', async () => {
        const ti = 1;
        await request.default( server.app )
            .post( '/survey/books/reviews' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
                reviews: { '1': { 'rating': 1, 'Book-Title': `b${ti}_0` } },
            } )
            .expect( StatusCodes.UNAUTHORIZED );
    } );

    it( 'should not set for anauth user 1', async () => {
        const ti = 1;
        await request.default( server.app )
            .post( '/survey/books/reviews' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                reviews: { '1': { 'rating': 1, 'Book-Title': `b${ti}_0` } },
            } )
            .expect( StatusCodes.UNAUTHORIZED );
    } );

    it( 'should set properly 3', async () => {
        const ti = 3;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } );

        await request.default( server.app )
            .post( '/survey/books/reviews' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                reviews: { '1': { 'rating': 1, 'Book-Title': `b${ti}_0` } },
            } )
            .expect( StatusCodes.CREATED );
    } );

    it( 'should get properly 3', async () => {
        const ti = 4;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } );

        await request.default( server.app )
            .post( '/survey/books/reviews' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                reviews: { '1': { 'rating': 1, 'Book-Title': `b${ti}_0` } },
            } )
            .expect( StatusCodes.CREATED );

        await request.default( server.app )
            .post( '/survey/books/reviews' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
            } )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.reviews ).toStrictEqual(
                    { '1': { 'rating': 1, 'Book-Title': `b${ti}_0` } },
                );
            } );
    } );
} );
