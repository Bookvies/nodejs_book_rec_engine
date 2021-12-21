import { Injectable } from '@angular/core';


@Injectable( {
    providedIn: 'root',
} )
/**
 * Service for transfering message to notification component
 *
 * @export
 * @class NotificationServiceService
 */
export class NotificationServiceService {
    listener: ( message: string ) => void = () => {};

    /**
   * Creates an instance of NotificationServiceService.
   */
    constructor () { }

    /**
     * Sends message to listener.
     * Usually listener is notification components
     *
     * @param {string} message
     */
    show_message ( message: string ) {
        this.listener( message );
    }

    /**
     * Sets new listener for a messages
     *
     * @param {function( message: string ): void} new_listener
     */
    on ( new_listener: ( message: string ) => void ) {
        this.listener = new_listener;
    }
}
