

/**
 * Function that always fails and outputs argument. Usefull when dealing with async
 *
 * @export
 * @param {*} arg
 */
export function fail ( arg: any ) {
    expect( arg ).toBe( 'Fail from a custom function' );
}
