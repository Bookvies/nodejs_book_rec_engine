import { Component, Input, OnInit } from '@angular/core';
import { book_typedef, DatasetService } from '../dataset.service';

export const google_search_action = {
    name: 'More info',
    action: ( book: book_typedef ) => {
        // eslint-disable-next-line max-len
        const to_search = `${book['Book-Author'].replace( ' ', '+' )}+-+${book['Book-Title'].replace( ' ', '+' ).replace}`;
        window.open( 'https://www.google.com/search?q=' + to_search, '_blank' );
    },
};

@Component( {
    selector: 'app-book-search',
    templateUrl: './book-search.component.html',
    styleUrls: ['./book-search.component.scss'],
} )
/**
 *
 *
 * @export
 * @class BookSearchComponent
 * @implements {OnInit}
 */
export class BookSearchComponent implements OnInit {
    search_res: Array<book_typedef> = [];
    to_search: string = '';
    @Input() extra_actions: Array<{ name: string, action: ( book: book_typedef ) => void }> = [];

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

    /**
     *
     *
     */
    run_search () {
        this.search_res = this.dataset.search_for_books( this.to_search.split( ' ' ), 100 );
    }
}
