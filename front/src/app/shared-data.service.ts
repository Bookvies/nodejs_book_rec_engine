import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';

@Injectable( {
    providedIn: 'root',
} )
/**
 *
 *
 * @export
 * @class SharedDataService
 */
export class SharedDataService {
    current_username?: string = undefined;
    get_username_unterval;

    /**
     * Creates an instance of SharedDataService.
     */
    constructor ( private http: HttpServiceService ) {
        this.http.request( 'get', '/auth/get_username', undefined )
            .then( ( val ) => {
                if ( typeof val.data.username == 'undefined' ||
                    typeof val.data.username == 'string' ) {
                    this.current_username = val.data.username;
                }
            } )
            .catch( ( ) => {

            } );

        this.get_username_unterval = setInterval( async () => {
            await this.http.request( 'get', '/auth/get_username', undefined )
                .then( ( val ) => {
                    if ( typeof val.data.username == 'undefined' ||
                    typeof val.data.username == 'string' ) {
                        this.current_username = val.data.username;
                    }
                } )
                .catch( ( ) => {

                } );
            console.log( 'Got new username: ', this.current_username );
        }, 15000 );
    }
}
