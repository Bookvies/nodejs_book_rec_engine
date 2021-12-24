/* eslint-disable require-jsdoc */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataService } from './shared-data.service';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
} )
export class AppComponent {
    title = 'front';

    constructor (
        private translate: TranslateService,
        private shared_data: SharedDataService,
        private router: Router ) {
        // start tranlation service
        this.translate.use( 'en' );
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }
}
