import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../http-service.service';
import { SharedDataService } from '../shared-data.service';


@Component( {
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
} )
/**
 *
 *
 * @export
 * @class UserComponent
 * @implements {OnInit}
 */
export class UserComponent implements OnInit {
    username: string = '';
    active_tab: string = 'Books';
    exists: boolean = false;

    /**
     * Creates an instance of UserComponent.
     */
    constructor (
        public shared_data: SharedDataService,
        private active_route: ActivatedRoute,
        private http: HttpServiceService,
    ) { }

    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
        this.username = this.active_route.snapshot.paramMap.get( 'username' ) || 'null';
        this.http.request( 'post', '/auth/user_exists', { username: this.username } )
            .then( ( val ) => {
                this.exists = val.data.result;
            } )
            .catch( ( err ) => {
                console.log( err );
            } );
    }
}
