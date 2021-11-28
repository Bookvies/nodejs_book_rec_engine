describe( 'Dummy', () => {
    let counter = 0;

    beforeEach( () => {
        counter = 1;
    } );

    it( 'should work with before each', async () => {
        expect( counter + 1 ).toEqual( 2 );
        return 0;
    } );
} );
