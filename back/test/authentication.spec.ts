import { auth_module, auth_module_config } from '../authentication';
import { logger } from '../logger';
import { integration_helpers } from './helpers/integration-helpers';

// NOT IMPLEMENTED

describe( 'Auth', () => {
    const ih = new integration_helpers( {
        db_name: 'authentication_spec',
    } );
    let auth: auth_module;
    const auth_config: auth_module_config = {
        MS_PER_TTL_TICK: 400,
        NEW_TTL_ON_ACTION: 3,
        NEW_TTL_ON_LOGIN: 3,
    };

    beforeAll( async () => {
        const db = await ih.get_database();
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
                prefix: 'AUTH_SPEC',
            } ) );
    } );

    it( 'should register without error 1', async () => {
        const ti = 1;
        for ( let i = 0; i < 10; i ++ ) {
            auth.register( `c${ti}_${i}`, `a${ti}_${i}`, `p${ti}_${i}` )
                .then( ( val ) => {
                    expect( val.succ ).toBeTruthy();
                } ); ;
        }
    } );

    it( 'should login properly 2', async () => {
        const ti = 2;
        const prom_array = [];
        for ( let i = 0; i < 10; i ++ ) {
            prom_array.push( auth.register( `c${ti}_${i}`, `a${ti}_${i}`, `p${ti}_${i}` ) );
        }

        await Promise.all( prom_array );

        for ( let i = 0; i < 10; i ++ ) {
            await auth.login( `c${ti}_${i}`, `a${ti}_${i}`, `p${ti}_${i}` )
                .then( ( val ) => {
                    expect( val.succ ).toBeTruthy();
                } );
        }
    } );

    it( 'should reject improper username of less then three symbols 3', async () => {
        const ti = 3;
        await auth.register( `c${ti}_0`, `a`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.login( `c${ti}_0`, `a`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );

        await auth.register( `c${ti}_1`, `aa`, `p${ti}_1` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.login( `c${ti}_1`, `aa`, `p${ti}_1` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );

        await auth.register( `c${ti}_2`, ``, `p${ti}_2` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.login( `c${ti}_2`, ``, `p${ti}_2` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
    } );

    it( 'should reject improper username containing wrong symbols 4', async () => {
        const ti = 4;
        await auth.register( `c${ti}_0`, `1aaa`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.login( `c${ti}_0`, `1aaa`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );

        await auth.register( `c${ti}_1`, `aaa-`, `p${ti}_1` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.login( `c${ti}_1`, `aaa-`, `p${ti}_1` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );

        await auth.register( `c${ti}_2`, `aaa+`, `p${ti}_2` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.login( `c${ti}_2`, `aaa+`, `p${ti}_2` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
    } );

    it( 'should reject registation with same username 5', async () => {
        const ti = 5;
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeTruthy();
            } );

        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
    } );

    it( 'should not login before registration 6', async () => {
        const ti = 6;
        await auth.login( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeTruthy();
            } );
        await auth.login( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeTruthy();
            } );
    } );

    it( 'should be active after registration 7', async () => {
        const ti = 7;
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` );
        expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toEqual( `a${ti}_0` );
    } );

    it( 'should remove active status after some time 8', ( done ) => {
        const ti = 8;
        auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( ) => {
                setTimeout( () => {
                    expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toBeFalsy();
                    done();
                }, auth_config.MS_PER_TTL_TICK * auth_config.NEW_TTL_ON_LOGIN * 2 );
            } );
    } );

    it( 'should keep active status if actions are made 9', ( done ) => {
        const ti = 9;
        auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( ) => {
                setTimeout( () => {
                    auth.user_action( `c${ti}_0`, 'test' );
                }, auth_config.MS_PER_TTL_TICK * auth_config.NEW_TTL_ON_LOGIN );
                setTimeout( () => {
                    expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toEqual( `a${ti}_0` );
                    done();
                }, auth_config.MS_PER_TTL_TICK * auth_config.NEW_TTL_ON_LOGIN * 2 );
            } );
    } );

    it( 'should not become active on action if he was inactive 10', ( done ) => {
        const ti = 10;
        auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( ) => {
                setTimeout( () => {
                    expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toBeFalsy( );
                    auth.user_action( `c${ti}_0`, 'test' );
                    expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toBeFalsy();
                    done();
                }, auth_config.MS_PER_TTL_TICK * auth_config.NEW_TTL_ON_LOGIN * 2 );
            } );
    } );

    it( 'should exit properly 11', async ( ) => {
        const ti = 11;
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` );
        expect( auth.exit( `c${ti}_0` ).succ ).toBeTruthy();
        expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toBeFalsy();
    } );

    it( 'should become active on login 12', async ( ) => {
        const ti = 12;
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` );
        auth.exit( `c${ti}_0` );
        await auth.login( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` );
        expect( auth.get_username_by_cookie( `c${ti}_0` ) ).toBeTruthy();
    } );

    it( 'should not login with wrong passord 13', async ( ) => {
        const ti = 13;
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` );
        await auth.login( `c${ti}_0`, `a${ti}_0`, `p${ti}_1` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
    } );

    it( 'should not login before rgistration 14', async ( ) => {
        const ti = 14;
        await auth.login( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` )
            .then( ( val ) => {
                expect( val.succ ).toBeFalsy();
            } );
    } );

    it( 'should not exit if inactive 15', async ( ) => {
        const ti = 15;
        expect( auth.exit( `c${ti}_0` ).succ ).toBeFalsy();
    } );

    it( 'should return false from user_exists is there is no such user 16', async () => {
        const ti = 16;
        expect( await auth.user_exists( `a${ti}_0` ) ).toBeFalsy();
    } );

    it( 'should return true from user_exists  17', async () => {
        const ti = 17;
        await auth.register( `c${ti}_0`, `a${ti}_0`, `p${ti}_0` );
        expect( await auth.user_exists( `a${ti}_0` ) ).toBeTruthy();
    } );
} );
