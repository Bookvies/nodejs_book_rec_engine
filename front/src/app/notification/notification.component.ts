import { Component, OnInit } from '@angular/core';
import { NotificationServiceService } from '../notification-service.service';


@Component( {
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
} )
/**
 *
 *
 * @export
 * @class NotificationComponent
 * @implements {OnInit}
 */
export class NotificationComponent implements OnInit {
    text: string = 'Text is missing<br>Try next time';
    notification_classes = { hidden: true };
    hide_timeout?: number;

    /**
   * Creates an instance of NotificationComponent.
   */
    constructor ( private notify_serivice: NotificationServiceService ) { }

    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
        this.notify_serivice.on( ( message: string ) => {
            this.text = message;
            this.show();
            if ( this.hide_timeout != undefined ) {
                window.clearTimeout( this.hide_timeout );
            }
            this.hide_timeout = window.setTimeout( () => {
                this.hide();
            }, 15 * 1000 );
        } );
    }

    /**
     * Hides notification
     *
     */
    hide () {
        this.notification_classes.hidden = true;
    }

    /**
     * Shows notification
     *
     */
    show () {
        this.notification_classes.hidden = false;
    }
}
