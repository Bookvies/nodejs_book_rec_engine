import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { book_review, book_typedef, DatasetService } from '../dataset.service';

export const google_search_action = {
    name: 'More info',
    action: ( book: book_typedef ) => {
        // eslint-disable-next-line max-len
        const to_search = `${book['Book-Author'].replace( new RegExp( ' ', 'g' ), '+' )}+-+${book['Book-Title'].replace( new RegExp( ' ', 'g' ), '+' )}`;
        window.open( 'https://www.google.com/search?q=' + to_search, '_blank' );
    },
};

@Component( {
    selector: 'app-book-search',
    templateUrl: './book-search.component.html',
    styleUrls: ['./book-search.component.scss'],
} )
/**
 * known action names: _RATE_THIS - adds a 10 star rating bar
 *
 * @export
 * @class BookSearchComponent
 * @implements {OnInit}
 */
export class BookSearchComponent implements OnInit {
    search_res: Array<book_typedef> = [];
    to_search: string = '';
    @Input() extra_actions: Array<{
        name: string,
        action: ( book: book_typedef, extra_data?: any ) => void
    }> = [];
    @Input() images_used: 'Image-URL-M' | 'Image-URL-S' = 'Image-URL-M';
    @Input() reviews: book_review = {};
    @Input() use_reviews: boolean = false;
    @Input() books: Array<book_typedef> = [];
    @Input() use_books: boolean = false;

    /**
     * Creates an instance of BookSearchComponent.
     * @param {DatasetService} dataset
     */
    constructor (
        private dataset: DatasetService,
    ) {}

    /**
     *
     *
     */
    ngOnInit (): void {
        this.run_search();
    }

    // eslint-disable-next-line require-jsdoc
    ngOnChanges ( _changes: SimpleChanges ): void {
        this.run_search();
    }

    /**
     *
     *
     */
    run_search () {
        if ( this.use_books ) {
            this.search_res = this.search_in_books( this.to_search.split( ' ' ) );
            return;
        }
        if ( this.use_reviews ) {
            this.search_res = this.dataset.get_books_by_review(
                this.reviews, this.to_search.split( ' ' ) );
            return;
        }
        this.search_res = this.dataset.search_for_books(
            this.to_search.split( ' ' ), 20,
            { ISBN: Object.keys( this.reviews ) },
        );
    }


    /**
     * Returns all books from this.books that has all words
     * in author or name
     *
     * @param {string[]} words
     * @return {*} Array<book_typedef>
     * @memberof BookSearchComponent
     */
    search_in_books ( words: Array<string> ) {
        const ret: Array<book_typedef> = [];

        for ( const book of this.books ) {
            let ok: boolean = true;
            for ( const word of words ) {
                if ( book['Book-Title'].toLocaleLowerCase()
                    .indexOf( word.toLocaleLowerCase() ) < 0 &&
                        book['Book-Author'].toLocaleLowerCase()
                            .indexOf( word.toLocaleLowerCase() ) < 0 ) {
                    ok = false;
                }
            }
            if ( ok ) {
                ret.push( book );
            }
        }

        return ret;
    }
}
