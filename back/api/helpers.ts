/*
As i see it pages will export functions ( res, req, extra_data ) => void and req path for them
    which later will be added to server

Extra data will be provided by request handler. It will contains somethig like is_logged_in

This file will contain api common bentween different pages
*/

export interface any_object {
    [key: string]: any,
}


/**
 *
 *
 * @export
 * @param {any_object} object
 * @param {Array<string>} fields_to_check
 * @return {*}  {{ ok: boolean, missing: string }}
 */
export function object_field_checker (
    object: any_object,
    fields_to_check: Array<string>,
) : { ok: boolean, missing: string } {
    if ( object === undefined ) {
        throw new Error( 'object_field_checker: Object is undefined' );
    }
    for ( const field of fields_to_check ) {
        if ( object[field] === undefined ) {
            return { ok: false, missing: field };
        }
    }

    return { ok: true, missing: '' };
}
