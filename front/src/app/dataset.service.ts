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
    'index'?: Array<number>;
    'ISBN'?: Array<string>;
    'Book-Title'?: Array<string>;
    'Book-Author'?: Array<string>;
    'Image-URL-M'?: Array<string>;
    'Image-URL-S'?: Array<string>;
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
    ): Array<book_typedef> {
        const ret: Array<book_typedef> = [];

        for ( const book of this.books ) {
            let ok: boolean = true;
            for ( const prop in exclude ) {
                // Typescript type checker is too stupid to
                // convert iterator over object to literal type
                // eslint-disable-next-line max-len
                if ( ( exclude[prop as 'index' | 'ISBN' | 'Book-Title' | 'Book-Author' | 'Image-URL-M' | 'Image-URL-S'] as Array<string | number> ).indexOf(
                    // eslint-disable-next-line max-len
                    book[prop as 'index' | 'ISBN' | 'Book-Title' | 'Book-Author' | 'Image-URL-M' | 'Image-URL-S'] ) >= 0
                ) {
                    ok = false;
                    break;
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
     * Return all book that match review's ISBN and has all words
     * in book or author name
     *
     * @param {book_review} reviews
     * @param {Array<string>} [words=[]]
     * @return {*}  {Array<book_typedef>}
     */
    get_books_by_review (
        reviews: book_review,
        words: Array<string> = [],
    ): Array<book_typedef> {
        const ret: Array<book_typedef> = [];

        for ( const book of this.books ) {
            let ok: boolean = false;
            if ( book.ISBN in reviews ) {
                ok = true;
            }
            if ( !ok ) {
                continue;
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
            }
        }

        return ret;
    }
}
