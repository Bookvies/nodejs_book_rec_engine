import { book_reviews, database, DATABASE_ERROR_CODES } from '../database';
import { integration_helpers } from './helpers/integration-helpers';
import { fail } from './helpers/function_helpers';

describe( 'Database basic', () => {
    const ih = new integration_helpers( {
        db_name: 'database_spec',
    } );
    let db_client: database;


    beforeAll( async () => {
        db_client = await ih.get_database();
        await db_client.connect();
        await db_client.user_collection?.deleteMany( { } );
        await db_client.book_reviews_collection?.deleteMany( { } );
    } );

    afterAll( ( done ) => {
        db_client.disconnect()
            .then( () => {
                done();
            } ).catch( ( err ) => {
                done.fail( `After all: disconnect failed \n${err}` );
            } );
    } );

    afterEach( async ( ) => {
        await db_client.user_collection?.deleteMany( { } );
        await db_client.book_reviews_collection?.deleteMany( { } );
    } );

    it( 'should insert single user without error', ( done ) => {
        db_client.add_passwd_for_user( '1_a', '1_p' )
            .then( () => {
                done();
            } )
            .catch( ( err ) => {
                fail( err );
            } );
    } );

    it( 'should insert multiple user without error', ( done ) => {
        const prom_array = [];
        prom_array.push( db_client.add_passwd_for_user( '1_a', '1_p' ) );
        prom_array.push( db_client.add_passwd_for_user( '2_a', '2_p' ) );
        prom_array.push( db_client.add_passwd_for_user( '3_a', '3_p' ) );
        prom_array.push( db_client.add_passwd_for_user( '4_a', '4_p' ) );
        prom_array.push( db_client.add_passwd_for_user( '5_a', '5_p' ) );
        prom_array.push( db_client.add_passwd_for_user( '6_a', '6_p' ) );

        Promise.all( prom_array )
            .catch( ( err ) => {
                done.fail( err );
            } ).finally( ( ) => {
                done();
            } );
    } );

    it( 'should track insert collisions properly', async ( ) => {
        await db_client.add_passwd_for_user( '1_a', '1_p' )
            .then( () => {

            } )
            .catch( ( err ) => {
                fail( '1 ' + JSON.stringify( err ) );
            } );
        await db_client.add_passwd_for_user( '2_a', '1_p' )
            .then( () => {

            } )
            .catch( ( err ) => {
                fail( '2 ' + JSON.stringify( err ) );
            } );
        await db_client.add_passwd_for_user( '1_a', '3_p' )
            .then( () => {
                fail( '1_a should not beinserted twice' );
            } )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.ALREADY_PRESENT );
                expect( err.origin ).toEqual( 'database' );
            } );
        await db_client.add_passwd_for_user( '2_a', '4_p' )
            .then( () => {
                fail( '2_a should not beinserted twice' );
            } )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.ALREADY_PRESENT );
                expect( err.origin ).toEqual( 'database' );
            } );
        await db_client.add_passwd_for_user( '3_a', '5_p' )
            .then( () => {

            } )
            .catch( ( err ) => {
                fail( '5 ' + JSON.stringify( err ) );
            } );
        await db_client.add_passwd_for_user( '3_a', '6_p' )
            .then( () => {
                fail( '3_a should not beinserted twice' );
            } )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.ALREADY_PRESENT );
                expect( err.origin ).toEqual( 'database' );
            } );
    } );

    it( 'should retrieve successfuly', async () => {
        const prom_array = [];
        for ( let i = 0; i < 10; i ++ ) {
            prom_array.push( db_client.add_passwd_for_user( `${i}_a`, `${i}_p` ) );
        }

        await Promise.all( prom_array );

        for ( let i = 0; i < 10; i ++ ) {
            await db_client.retrieve_user_passwd( `${i}_a` )
                .then( ( val ) => {
                    expect( val.passwd_hash ).toEqual( `${i}_p` );
                } );
        }
    } );

    it( 'should fail properly upon retrieve', async () => {
        const prom_array = [];
        for ( let i = 0; i < 10; i ++ ) {
            prom_array.push( db_client.add_passwd_for_user( `${i}_a`, `${i}_p` ) );
        }

        await Promise.all( prom_array );

        for ( let i = 10; i < 20; i ++ ) {
            await db_client.retrieve_user_passwd( `${i}_a` )
                .catch( ( err ) => {
                    expect( err.code ).toEqual( DATABASE_ERROR_CODES.NOT_FOUND );
                    expect( err.origin ).toEqual( 'database' );
                } );
        }
    } );

    it( 'should insert single review without error', ( done ) => {
        db_client.add_book_reviews_for_user( '1_a', { '1': { 'rating': 1, 'Book-Title': '1_' } } )
            .then( () => {
                done();
            } )
            .catch( ( err ) => {
                fail( err );
            } );
    } );

    it( 'should insert multiple user without error', ( done ) => {
        const prom_array = [];
        for ( let i = 0; i < 6; i++ ) {
            const rev: book_reviews = {};
            const str = `${i}`;
            rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
            prom_array.push( db_client.add_book_reviews_for_user( `${i}_a`, rev ) );
        }

        Promise.all( prom_array )
            .catch( ( err ) => {
                done.fail( err );
            } ).finally( ( ) => {
                done();
            } );
    } );

    it( 'should retrieve successfuly', async () => {
        const prom_array = [];
        for ( let i = 0; i < 10; i++ ) {
            const rev: book_reviews = {};
            const str = `${i}`;
            rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
            prom_array.push( db_client.add_book_reviews_for_user( `${i}_a`, rev ) );
        }

        await Promise.all( prom_array );

        for ( let i = 0; i < 10; i ++ ) {
            await db_client.retrieve_book_reviews( `${i}_a` )
                .then( ( val ) => {
                    const rev: book_reviews = {};
                    const str = `${i}`;
                    rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
                    expect( val.reviews ).toEqual( rev );
                } );
        }
    } );

    it( 'should fail properly upon retrieve', async () => {
        const prom_array = [];
        for ( let i = 0; i < 10; i++ ) {
            const rev: book_reviews = {};
            const str = `${i}`;
            rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
            prom_array.push( db_client.add_book_reviews_for_user( `${i}_a`, rev ) );
        }

        await Promise.all( prom_array );

        for ( let i = 10; i < 20; i ++ ) {
            await db_client.retrieve_book_reviews( `${i}_a` )
                .catch( ( err ) => {
                    expect( err.code ).toEqual( DATABASE_ERROR_CODES.NOT_FOUND );
                    expect( err.origin ).toEqual( 'database' );
                } );
        }
    } );

    it( 'should upsert successfuly', async () => {
        const prom_array = [];
        for ( let i = 0; i < 10; i++ ) {
            const rev: book_reviews = {};
            const str = `${i}`;
            rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
            prom_array.push( db_client.add_book_reviews_for_user( `${i}_a`, rev ) );
        }

        await Promise.all( prom_array );

        const prom_array_2 = [];
        for ( let i = 0; i < 10; i++ ) {
            const rev: book_reviews = {};
            let str = `${i}`;
            rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
            str = `${i + 10}`;
            rev[str] = { 'rating': i + 10, 'Book-Title': `${i + 10}_b` };
            prom_array_2.push( db_client.add_book_reviews_for_user( `${i}_a`, rev ) );
        }

        await Promise.all( prom_array_2 );

        for ( let i = 0; i < 10; i ++ ) {
            await db_client.retrieve_book_reviews( `${i}_a` )
                .then( ( val ) => {
                    const rev: book_reviews = {};
                    let str = `${i}`;
                    rev[str] = { 'rating': i, 'Book-Title': `${i}_b` };
                    str = `${i + 10}`;
                    rev[str] = { 'rating': i + 10, 'Book-Title': `${i + 10}_b` };
                    expect( val.reviews ).toEqual( rev );
                } );
        }
    } );
} );

describe( 'Database without connection', () => {
    const ih = new integration_helpers( {
        db_name: 'database_disconnected_spec',
    } );
    let db_client: database;

    beforeAll( async () => {
        db_client = await ih.get_database();
    } );

    it( 'should throw when calling add_passwd_for_user if collection is undef ', async () => {
        await db_client.add_passwd_for_user( '1_a', '1_p' )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.COLLECTION_UNDEFINED );
                expect( err.origin ).toEqual( 'database' );
            } );
    } );

    it( 'should throw when calling retrieve_user_passwd if collection is undef ', async () => {
        await db_client.retrieve_user_passwd( '1_a' )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.COLLECTION_UNDEFINED );
                expect( err.origin ).toEqual( 'database' );
            } );
    } );

    it( 'should throw when calling add_book_reviews_for_user if collection is undef ', async () => {
        await db_client.add_book_reviews_for_user(
            '1_a',
            { '1': { 'rating': 1, 'Book-Title': '1_' } },
        )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.COLLECTION_UNDEFINED );
                expect( err.origin ).toEqual( 'database' );
            } );
    } );

    it( 'should throw when calling retrieve_book_reviews if collection is undef ', async () => {
        await db_client.retrieve_book_reviews( '1_a' )
            .catch( ( err ) => {
                expect( err.code ).toEqual( DATABASE_ERROR_CODES.COLLECTION_UNDEFINED );
                expect( err.origin ).toEqual( 'database' );
            } );
    } );
} );
