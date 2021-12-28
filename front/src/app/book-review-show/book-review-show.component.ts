import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { google_search_action } from '../book-search/book-search.component';
import { book_review, book_typedef, DatasetService } from '../dataset.service';
import { SharedDataService } from '../shared-data.service';


@Component( {
    selector: 'app-book-review-show',
    templateUrl: './book-review-show.component.html',
    styleUrls: ['./book-review-show.component.scss'],
} )
/**
 *
 *
 * @export
 * @class BookReviewShowComponent
 * @implements {OnInit}
 */
export class BookReviewShowComponent implements OnInit {
    reviews: book_review = {};
    google_search_action = google_search_action;

    editing: boolean = false;
    allow_edit = false;
    modal_classes = {
        'is-active': false,
    };

    /**
     * Creates an instance of BookReviewShowComponent.
     * @param {DatasetService} dataset
     */
    constructor (
        private dataset: DatasetService,
        private active_route: ActivatedRoute,
        private shared_data: SharedDataService,
        private change_detection: ChangeDetectorRef,
    ) { }


    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
        if ( this.shared_data.current_username != undefined ) {
            this.allow_edit = this.shared_data.current_username ==
                this.active_route.snapshot.paramMap.get( 'username' );
        }
    }

    /**
     *
     *
     */
    save_changes () {
        this.editing = false;
        console.log( this.reviews );
    }

    /**
     *
     *
     * @param {book_typedef} book
     * @param {{ rating: number }} extra_data
     */
    on_rate ( book: book_typedef, extra_data: { rating: number } ) {
        if ( book.ISBN in this.reviews ) {
            this.reviews[book.ISBN].rating = extra_data.rating;
        }
    }

    /**
     *
     *
     * @param {book_typedef} book
     */
    add_new ( book: book_typedef ) {
        console.log( 'adding' );
        this.reviews[book.ISBN] = {
            'rating': 0,
            'Book-Title': book['Book-Title'],
        };
    }

    /**
     *
     *
     * @param {book_typedef} book
     */
    delete_one ( book: book_typedef ) {
        delete this.reviews[book.ISBN];
    }
}
