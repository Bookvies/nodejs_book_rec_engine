import { database, database_config } from '../database';
import { logger } from '../logger';

describe( 'Database basic', () => {
    const database_config: database_config = {
        address: 'mongodb://localhost:27017',
        db_name: 'database_spec',
    };
    const db_client = new database(
        database_config,
        new logger(
            { debug: false,
                info: false,
                warn: false,
                error: false,
                prefix: 'DB',
            } ) );

    beforeAll( ( done ) => {
        db_client.connect()
            .then( () => {
                done();
            } ).catch( ( err ) => {
                done.fail( `Before all: connection failed \n${err}` );
            } );
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
