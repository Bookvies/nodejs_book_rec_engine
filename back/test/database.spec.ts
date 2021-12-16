import { database } from '../database';
import { integration_helpers } from './helpers/integration-helpers';

describe( 'Database basic', () => {
    const ih = new integration_helpers( {
        db_name: 'database_spec',
    } );
    let db_client: database;


    beforeAll( async () => {
        db_client = await ih.get_database();
        await db_client.connect();
    } );

    afterAll( ( done ) => {
        db_client.disconnect()
            .then( () => {
                done();
            } ).catch( ( err ) => {
                done.fail( `After all: disconnect failed \n${err}` );
            } );
    } );

    afterEach( ( done ) => {
        db_client.user_collection?.deleteMany( { a: 3 } )
            .then( () => {
                done();
            } ).catch( ( err ) => {
                done.fail( `After each: clearing failed \n${err}` );
            } );
    } );

    it( 'should insert', ( done ) => {
        db_client.testing_inserion()
            .then( async () => {
                const t = await db_client.testing_find();
                expect( t.length ).toEqual( 1 );
                expect( t[0]?.a ).toEqual( 3 );
                done();
            } )
            .catch( ( err ) => {
                done.fail( `Insertion failed \n${err}` );
            } ); ;
    } );

    it( 'should insert and remove', ( done ) => {
        db_client.testing_inserion()
            .then( async () => {
                await db_client.testing_delete()
                    .catch( ( err ) => {
                        fail( `Deletion failed \n${err}` );
                    } );
                const t = await db_client.testing_find();
                expect( t.length ).toEqual( 0 );
                done();
            } )
            .catch( ( err ) => {
                done.fail( `Insertion failed \n${err}` );
            } );
    } );
} );
