import { Injectable } from '@angular/core';
import * as books_json from '../assets/dataset/books.json';

export interface book_typedef {
    'index': number;
    'ISBN': string;
    'Book-Title': string;
    'Book-Author': string;
    'Image-URL-M': string;
    'Image-URL-S': string;
}

export interface book_typedef_filter {
    'index'?: number;
    'ISBN'?: string;
    'Book-Title'?: string;
    'Book-Author'?: string;
    'Image-URL-M'?: string;
    'Image-URL-S'?: string;
}

export interface book_review {
    [ISBN: string]: {
        rating: number,
        'Book-Title': string,
    }
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
     * @param {book_typedef_filter} [exclude={}]
     * @return {*} Array<book_typedef>
     */
    search_for_books (
        words: Array<string>,
        limit: number,
        exclude: book_typedef_filter = {},
    ) {
        const ret: Array<book_typedef> = [];

        for ( const book of this.books ) {
            let ok: boolean = true;
            for ( const prop in exclude ) {
                // Typescript type checker is too stupid to
                // convert iterator over object to literal type
                // eslint-disable-next-line max-len
                if ( exclude[prop as 'index' | 'ISBN' | 'Book-Title' | 'Book-Author' | 'Image-URL-M' | 'Image-URL-S'] ==
                            // eslint-disable-next-line max-len
                            book[prop as 'index' | 'ISBN' | 'Book-Title' | 'Book-Author' | 'Image-URL-M' | 'Image-URL-S'] ) {
                    continue;
                }
            }
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


    /**
     *
     *
     * @param {book_review} reviews
     * @return {*} Array<book_typedef>
     */
    get_books_by_review ( reviews: book_review ) {
        const ret: Array<book_typedef> = [];

        for ( const book of this.books ) {
            if ( book.ISBN in reviews ) {
                ret.push( book );
            }
        }

        return ret;
    }
}
