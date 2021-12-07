import 'jest';
import * as express from 'express';
import * as request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';

import IntegrationHelpers from '../helpers/integration-helpers';

describe( 'status integration tests', () => {
    let app: express.Application;

    beforeAll( async () => {
        app = await IntegrationHelpers.getApp();
    } );

    it( 'can get dummy one', async () => {
        await request.default( app )
            .get( '/dummy_test/one' )
            .set( 'Accept', 'application/json' )
            .expect( ( res: request.Response ) => {
                expect( res.body.data ).toEqual( 1 );
            } )
            .expect( StatusCodes.OK );
    } );

    it( 'should get the error', async () => {
        await request.default( app )
            .get( '/some_random_unexisting_address' )
            .set( 'Reject', 'application/json' )
            .expect( StatusCodes.NOT_FOUND );
    } );
} );
