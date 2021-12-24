import { Injectable } from '@angular/core';
import * as books_json from '../assets/dataset/books.json';

export interface book_typedef {
    index: number;
    ISBN: string;
    'Book-Title': string;
    'Book-Author': string;
    'Image-URL-L': string;
    'Image-URL-M': string;
}

@Injectable( {
    providedIn: 'root',
} )
/**
 *
 *
 * @export
 * @class DatasetService
 */
export class DatasetService {
    private books: Array<book_typedef> = ( books_json as any ).default.data;

    /**
     * Creates an instance of DatasetService.
     */
    constructor () {
        console.log( typeof books_json, books_json );
    }

    /**
     * Returns array of books, no more then limit
     * Each element of array has all words in name or author
     *
     * @param {Array<string>} words
     * @param {number} limit
     * @return {*}
     */
    search_for_books ( words: Array<string>, limit: number ) {
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
                if ( ret.length >= limit ) {
                    break;
                }
            }
        }
        return ret;
    }
}
