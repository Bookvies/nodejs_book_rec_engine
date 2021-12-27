import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { google_search_action } from '../book-search/book-search.component';
import { book_typedef } from '../dataset.service';
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


    // eslint-disable-next-line require-jsdoc
    on_rate ( book: book_typedef, extra_data: { rating: number } ) {
        console.log( extra_data.rating );
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
