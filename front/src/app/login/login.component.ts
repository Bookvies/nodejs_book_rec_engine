import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as sha256 from 'crypto-js/sha256';
import { HttpServiceService } from '../http-service.service';
import { SharedDataService } from '../shared-data.service';

@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
} )
/**
 *
 *
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */
export class LoginComponent implements OnInit {
    result: string = '';
    username: string = '';
    password: string = '';
    /**
   * Creates an instance of LoginComponent.
   */
    constructor ( private http: HttpServiceService,
        private router: Router,
        private shared_data: SharedDataService ) { }


    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
        this.result = '';
        this.username = '';
        this.password = '';
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

        const to_send = {
            username: this.username,
            password_hash: ( sha256 as any )( this.password ).toString(),
        };

        console.log( 'Sending login', to_send );

        this.http.request( 'post', '/auth/login', to_send )
            .then( ( val ) => {
                if ( val.data.username == to_send.username ) {
                    this.shared_data.current_username = val.data.username;
                    this.router.navigateByUrl( '/' );
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
