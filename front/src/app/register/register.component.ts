import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as sha256 from 'crypto-js/sha256';
import { HttpServiceService } from '../http-service.service';
import { SharedDataService } from '../shared-data.service';


@Component( {
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
} )
/**
 *
 *
 * @export
 * @class RegisterComponent
 * @implements {OnInit}
 */
export class RegisterComponent implements OnInit {
    username: string = '';
    password: string = '';
    repeat_password: string = '';
    result: string = '';
    /**
     * Creates an instance of RegisterComponent.
     */
    constructor (
        private http: HttpServiceService,
        private router: Router,
        private shared_data: SharedDataService,
    ) { }

    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
        this.username = '';
        this.password = '';
        this.repeat_password = '';
        this.result = '';
    }

    /**
     *
     *
     */
    send () {
        if ( this.username == '' ) {
            this.result = 'Username should not be empty';
            return;
        }
        if ( this.password == '' ) {
            this.result = 'Password should not be empty';
            return;
        }
        if ( this.password != this.repeat_password ) {
            this.result = 'Passwords dosn\'t match';
            return;
        }

        const to_send = {
            username: this.username,
            password_hash: ( sha256 as any )( this.password ).toString(),
        };

        console.log( 'Sending register', to_send );

        this.http.request( 'post', '/auth/register', to_send )
            .then( ( val ) => {
                if ( val.data.username == to_send.username ) {
                    this.shared_data.current_username = val.data.username;
                    this.router.navigateByUrl( `/user/val.data.username` );
                } else {
                    this.result = 'Recieved and sent username doesnt match.. somehow';
                }
            } )
            .catch( ( err ) => {
                if ( err ) {
                    this.result = err.data.reason;
                }
            } );
    }
}
