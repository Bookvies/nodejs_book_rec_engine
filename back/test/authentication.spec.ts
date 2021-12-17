import { integration_helpers } from './helpers/integration-helpers';

// NOT IMPLEMENTED

describe( 'Auth', () => {
    const ih = new integration_helpers( {
        db_name: 'authentication_spec',
    } );

    beforeEach( () => {
        ih;
    } );

    it( 'should work with before each', async () => {
        expect( 2 ).toEqual( 2 );
    } );
} );
