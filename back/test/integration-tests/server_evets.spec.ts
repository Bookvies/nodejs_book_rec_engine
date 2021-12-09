import 'jest';
import * as request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';

import * as integration_helpers from '../helpers/integration-helpers';
import { express_app } from '../../server';

describe( 'server events', () => {
    const instance = new integration_helpers.integration_helpers( { server_port: 0 } );
    let server: express_app;


    beforeAll( async () => {
        server = await instance.get_server();
    } );

    const methods: Array<'get' | 'post' | 'put'> = ['get', 'post', 'put'];
    for ( const method of methods ) {
        for ( let iter = 0; iter < 10; iter ++ ) {
            const random_addr_1 =
                `/${Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 8 )}` +
                `/${Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 8 )}`;
            // eslint-disable-next-line max-len
            it( `should add and del callback for ${method} at iter ${iter}; addr "${random_addr_1}"`,
                ( done ) => {
                    const i = iter;
                    // eslint-disable-next-line max-len
                    let req: ( url: string, callback?: request.CallbackHandler | undefined ) => request.Test;
                    switch ( method ) {
                    case 'post':
                        req = request.default( server.app ).post;
                        break;
                    case 'put':
                        req = request.default( server.app ).put;
                        break;
                    default:
                        req = request.default( server.app ).get;
                        break;
                    }
                    expect( server.has_callback( method, random_addr_1 ) ).toBeFalsy();

                    req( random_addr_1 )
                        .set( 'Accept', 'application/json' )
                        .expect( StatusCodes.NOT_FOUND )
                        .then( () => {
                            server.on( method, random_addr_1, async ( req, res, extra_data ) => {
                                res.json( { data: method, iter: i } );
                                res.status( StatusCodes.OK );
                                res.end();
                            } );

                            expect( server.has_callback( method, random_addr_1 ) ).toBeTruthy();

                            req( random_addr_1 )
                                .set( 'Accept', 'application/json' )
                                .expect( StatusCodes.OK )
                                .expect( ( res: request.Response ) => {
                                    expect( res.body.data ).toEqual( method );
                                    expect( res.body.iter ).toEqual( i );
                                } )
                                .then( () => {
                                    server.unsubscribe( method, random_addr_1 );

                                    expect( server.has_callback( method, random_addr_1 ) )
                                        .toBeFalsy();

                                    req( random_addr_1 )
                                        .set( 'Accept', 'application/json' )
                                        .expect( StatusCodes.NOT_FOUND, done );
                                } );
                        } );
                } );
        }
        const random_addr_2 =
            `/${Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 8 )}` +
            `/${Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 8 )}`;
        it( `should return 500 if callback for ${method} fails; addr "${random_addr_2}"`,
            ( done ) => {
                // eslint-disable-next-line max-len
                let req: ( url: string, callback?: request.CallbackHandler | undefined ) => request.Test;
                switch ( method ) {
                case 'post':
                    req = request.default( server.app ).post;
                    break;
                case 'put':
                    req = request.default( server.app ).put;
                    break;
                default:
                    req = request.default( server.app ).get;
                    break;
                }

                server.on( method, random_addr_2, async ( req, res, extra_data ) => {
                    throw new Error( `${method}` );
                } );

                expect( server.has_callback( method, random_addr_2 ) ).toBeTruthy();

                req( random_addr_2 )
                    .set( 'Accept', 'application/json' )
                    .expect( StatusCodes.INTERNAL_SERVER_ERROR, () => {
                        server.unsubscribe( method, random_addr_2 );
                        done();
                    } );
            } );
    }


    it( 'can get dummy one', async () => {
        await request.default( server.app )
            .get( '/dummy_test/one' )
            .set( 'Accept', 'application/json' )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.data ).toEqual( 1 );
            } );
    } );

    it( 'should get the error', async () => {
        await request.default( server.app )
            .get( '/some_random_unexisting_address' )
            .set( 'Reject', 'application/json' )
            .expect( StatusCodes.NOT_FOUND );
    } );
} );
