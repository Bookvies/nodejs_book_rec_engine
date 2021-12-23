import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from '../http-service.service';
import { NotificationServiceService } from '../notification-service.service';
import { SharedDataService } from '../shared-data.service';


@Component( {
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
} )
/**
 *
 *
 * @export
 * @class HeaderComponent
 * @implements {OnInit}
 */
export class HeaderComponent implements OnInit {
    /**
     * Creates an instance of HeaderComponent.
     */
    constructor (
        public shared_data: SharedDataService,
        private http: HttpServiceService,
        private router: Router,
        private notification: NotificationServiceService,
    ) { }


    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
    }

    /**
     *
     *
     */
    log_out () {
        this.http.request( 'post', '/auth/exit', undefined )
            .then( ( val ) => {
                this.shared_data.current_username = val.data.username;
                this.router.navigateByUrl( '/' );
            } )
            .catch( ( err ) => {
                if ( err ) {
                    this.notification.show_message(
                        `Cannot log out because\n${err.data.reason}`,
                    );
                }
            } );
    }
}
