import { Injectable } from '@angular/core';
import { NotificationServiceService } from './notification-service.service';
import * as axios from 'axios';


@Injectable( {
    providedIn: 'root',
} )
/**
 *
 *
 * @export
 * @class HttpServiceService
 */
export class HttpServiceService {
    /**
     * Creates an instance of HttpServiceService.
     */
    constructor ( private notify_serivice: NotificationServiceService ) { }


    /**
     * Interface for http requests
     * As for return value:
     * .then( ( val ) => { } ) will be called if request fall in 2xx boundaries
     * .catch( ( err ) => { if ( err ) {
     *       will be called for all status codes except 2xx, 404, 500
     * } else {
     *       Error while handling http request. Already logged
     * } } )
     *
     * @param {('get' | 'put' | 'post')} type
     * @param {string} url
     * @param {*} body
     * @return {*}
     */
    async request ( type: 'get' | 'put' | 'post', url: string, body: any ) {
        return axios.default( {
            method: type,
            url: url,
            data: body,
            timeout: 30000,
            withCredentials: true,
        } )
            .then( ( val ) => {
                console.log( 0, val );
                return val;
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( 1, err );
                    console.log( err.message );
                    if ( err.response.status == 404 ) {
                        this.notify_serivice.show_message(
                            'You are trying to access none existant resourse' );
                        throw undefined;
                    } else if ( err.response.status == 500 ) {
                        this.notify_serivice.show_message(
                            'Server seems to be experiencing error<br>Please, try again later' );
                        throw undefined;
                    } else if ( err.response.status == 502 || err.response.status == 504 ) {
                        this.notify_serivice.show_message(
                            'Gateway seems to be experiencing error<br>Please, try again later' );
                        throw undefined;
                    }
                    throw err.response;
                } else if ( err.request ) {
                    this.notify_serivice.show_message(
                        'Server not responging<br>Please, try again later' );
                    console.log( 2, err.message );
                    throw undefined;
                } else {
                    this.notify_serivice.show_message(
                        'Cant send http request<br>Please, try again later' );
                    console.log( 3, err );
                    throw undefined;
                }
            } );
    }
}
