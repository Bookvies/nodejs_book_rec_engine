import 'jest';
import * as request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';

import { integration_helpers } from '../helpers/integration-helpers';
import { express_app } from '../../server';

describe( 'integration helper tests', () => {
    const instance = new integration_helpers( { server_port: 0 } );
    let server: express_app;


    beforeAll( async () => {
        server = await instance.get_server();
    } );

    it( 'should not create server without socket being specified', ( done ) => {
        ( new integration_helpers( {} ).get_server() )
            .then( () => {
                done.fail( 'It should not be successful' );
            } )
            .catch( ( err: Error ) => {
                expect( err.message )
                    .toEqual( 'get_server used but server_port not specified in config' );
                done();
            } );
    } );

    it( 'should create server instance', () => {
        expect( server ).toBeTruthy();
        expect( server.app ).toBeTruthy();
    } );

    it( 'should not create new server if one already exists', async () => {
        expect( await instance.get_server() ).toBe( await instance.get_server() );
        expect( await instance.get_server() ).toBe( server );
    } );

    it( 'should get dummy one request', async () => {
        await request.default( server.app )
            .get( '/dummy_test/one' )
            .set( 'Accept', 'application/json' )
            .expect( StatusCodes.OK )
            .expect( ( res: request.Response ) => {
                expect( res.body.data ).toEqual( 1 );
            } );
    } );

    it( 'should get 404 for acessing', async () => {
        await request.default( server.app )
            .get( '/some_random_unexisting_address' )
            .set( 'Reject', 'application/json' )
            .expect( StatusCodes.NOT_FOUND );
    } );
} );
