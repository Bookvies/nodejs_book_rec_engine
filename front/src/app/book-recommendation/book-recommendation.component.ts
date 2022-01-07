import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { google_search_action } from '../book-search/book-search.component';
import { book_review, book_typedef } from '../dataset.service';
import { HttpServiceService } from '../http-service.service';


@Component( {
    selector: 'app-book-recommendation',
    templateUrl: './book-recommendation.component.html',
    styleUrls: ['./book-recommendation.component.scss'],
} )
/**
 *
 *
 * @export
 * @class BookRecommendationComponent
 * @implements {OnInit}
 */
export class BookRecommendationComponent implements OnInit {
    @Input() reviews: book_review = {};
    @Output() closing = new EventEmitter<boolean>();
    books: Array<book_typedef> = [];
    google_search_action = google_search_action;
    done = 0;
    /**
     * Creates an instance of BookRecommendationComponent.
     * @memberof BookRecommendationComponent
     */
    constructor (
        private http: HttpServiceService,
    ) {}

    // eslint-disable-next-line require-jsdoc
    ngOnInit () {
        this.done += 1;
        this.get_books();
    }

    // eslint-disable-next-line require-jsdoc
    ngOnChanges ( changes: SimpleChanges ): void {
        if ( 'reviews' in changes ) {
            this.done += 1;
            this.get_books();
        }
    }

    /**
     *
     *
     * @memberof BookRecommendationComponent
     */
    get_books () {
        if ( this.done == 1 ) {
            return;
        }
        this.http.request(
            'post',
            '/recommendations/books',
            { reviews: this.reviews },
        )
            .then( ( val ) => {
                this.books = val.data.books;
                console.log( this.books );
            } )
            .catch( ( err ) => {
                console.log( err );
            } )
        ;
    }

    /**
     *
     *
     * @memberof BookRecommendationComponent
     */
    on_close () {
        this.closing.emit( true );
    }
}
