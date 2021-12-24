import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { google_search_action } from '../book-search/book-search.component';
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
    google_search_action = google_search_action;

    /**
     * Creates an instance of BaseComponent.
     * @param {TranslateService} translate
     */
    constructor (
        private translate: TranslateService,
        private http: HttpServiceService,
    ) {

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
