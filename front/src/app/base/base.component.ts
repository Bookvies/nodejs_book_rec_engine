import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpServiceService } from '../http-service.service';


@Component( {
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
} )
/**
 *
 *
 * @export
 * @class BaseComponent
 * @implements {OnInit}
 */
export class BaseComponent implements OnInit {
    /**
     * Creates an instance of BaseComponent.
     * @param {TranslateService} translate
     */
    constructor ( private translate: TranslateService,
        private http: HttpServiceService ) {

    }

    /**
     *
     *
     */
    ngOnInit (): void {
        console.log( document.cookie );
    }

    /**
     *
     *
     */
    change_locale () {
        this.translate.use( this.translate.currentLang == 'en' ? 'ru' : 'en' );
    }
}
