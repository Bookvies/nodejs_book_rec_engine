import { object_field_checker } from '../../api/helpers';


describe( 'object_field_checker', () => {
    beforeEach( () => {
    } );

    it( 'should work on empty object', async () => {
        expect( object_field_checker( {}, [] ).ok ).toBeTruthy();

        expect( object_field_checker( {}, ['a', 'b'] ).ok ).toBeFalsy();
        expect( object_field_checker( {}, ['a', 'b'] ).missing ).toEqual( 'a' );
    } );

    it( 'should work on not empty  object', async () => {
        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, [] ).ok ).toBeTruthy();
        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, ['a'] ).ok ).toBeTruthy();
        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, ['a', 'b'] ).ok ).toBeTruthy();

        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, ['a', 'b', 'c', 'd'] ).ok )
            .toBeFalsy();
        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, ['a', 'b', 'c', 'd'] ).missing )
            .toEqual( 'c' );

        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, ['c', 'd'] ).ok ).toBeFalsy();
        expect( object_field_checker( { a: 3, b: { 'c': 4 } }, ['c', 'd'] ).missing )
            .toEqual( 'c' );
    } );
} );
