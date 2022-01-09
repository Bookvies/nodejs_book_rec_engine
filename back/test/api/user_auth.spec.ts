import 'jest';
import * as request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';

import * as integration_helpers from '../helpers/integration-helpers';
import { express_app } from '../../server';
import { auth_module, auth_module_config } from '../../authentication';
import { logger } from '../../logger';
import { auth_page } from '../../api/user_auth';

describe( 'server events', () => {
    const instance = new integration_helpers.integration_helpers( {
        server_port: 0,
        db_name: 'user_auth_spec',
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
    } );


    it( 'should be undefined for username without cookie 0', async () => {
        await request.default( server.app )
            .get( '/auth/get_username' )
            .set( 'Accept', 'application/json' )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should be undefined for username before registration 1', async () => {
        const ti = 1;
        await request.default( server.app )
            .get( '/auth/get_username' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should not register if fields are not specified 2', async () => {
        const ti = 2;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .send( {} )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .send( {
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
            } )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should register properly 3', async () => {
        const ti = 3;

        const prom_array = [];
        for ( let i = 0; i < 10; i++ ) {
            prom_array.push( request.default( server.app )
                .post( '/auth/register' )
                .set( 'Accept', 'application/json' )
                .set( 'Cookie', [`c${ti}_${i}`] )
                .send( {
                    username: `a${ti}_${i}`,
                    password_hash: `p${ti}_${i}`,
                } )
                .expect( StatusCodes.CREATED )
                .expect( ( res: request.Response ) => {
                    expect( res.body.username ).toEqual( `a${ti}_${i}` );
                } ) );
        }

        await Promise.all( prom_array );
    } );

    it( 'should be active after registration 4', async () => {
        const ti = 4;

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .get( '/auth/get_username' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );
    } );

    it( 'should exit properly 5', async () => {
        const ti = 5;

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .post( '/auth/exit' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .expect( StatusCodes.OK );

        await request.default( server.app )
            .get( '/auth/get_username' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should login properly 6', async () => {
        const ti = 6;

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .post( '/auth/exit' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .expect( StatusCodes.OK );

        await request.default( server.app )
            .post( '/auth/login' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .get( '/auth/get_username' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );
    } );

    it( 'should not login if fields are not specified 7', async () => {
        const ti = 7;
        await request.default( server.app )
            .post( '/auth/login' )
            .set( 'Accept', 'application/json' )
            .send( {} )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );

        await request.default( server.app )
            .post( '/auth/login' )
            .set( 'Accept', 'application/json' )
            .send( {
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );

        await request.default( server.app )
            .post( '/auth/login' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
            } )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );

        await request.default( server.app )
            .post( '/auth/login' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.BAD_REQUEST )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should not register twice for the same username 8', async () => {
        const ti = 8;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_1`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_1`,
            } )
            .expect( StatusCodes.UNAUTHORIZED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should not login before registration 9', async () => {
        const ti = 9;
        await request.default( server.app )
            .post( '/auth/login' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.UNAUTHORIZED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toBeFalsy();
            } );
    } );

    it( 'should not exit withour cookie 10', async () => {
        const ti = 10;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .post( '/auth/exit' )
            .set( 'Accept', 'application/json' )
            .expect( StatusCodes.BAD_REQUEST );
    } );

    it( 'should result into false from /auth/user_exists before registration 11', async () => {
        const ti = 11;
        await request.default( server.app )
            .post( '/auth/user_exists' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
            } )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.result ).toBeFalsy();
            } );
    } );

    it( 'should result into true from /auth/user_exists 12', async () => {
        const ti = 12;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .post( '/auth/user_exists' )
            .set( 'Accept', 'application/json' )
            .send( {
                username: `a${ti}_0`,
            } )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.result ).toBeTruthy();
            } );
    } );

    it( 'should result into error from /auth/user_exists without username 13', async () => {
        const ti = 13;
        await request.default( server.app )
            .post( '/auth/register' )
            .set( 'Accept', 'application/json' )
            .set( 'Cookie', [`c${ti}_0`] )
            .send( {
                username: `a${ti}_0`,
                password_hash: `p${ti}_0`,
            } )
            .expect( StatusCodes.CREATED )
            .expect( ( res: request.Response ) => {
                expect( res.body.username ).toEqual( `a${ti}_0` );
            } );

        await request.default( server.app )
            .post( '/auth/user_exists' )
            .set( 'Accept', 'application/json' )
            .expect( StatusCodes.BAD_REQUEST );
    } );
} );
