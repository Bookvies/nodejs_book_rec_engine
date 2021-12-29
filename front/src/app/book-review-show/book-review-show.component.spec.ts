import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RatingModule } from 'ng-starrating';
import { BookSearchComponent } from '../book-search/book-search.component';

import { BookReviewShowComponent } from './book-review-show.component';

describe( 'BookReviewShowComponent', () => {
    let component: BookReviewShowComponent;
    let fixture: ComponentFixture<BookReviewShowComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                BookReviewShowComponent,
                BookSearchComponent,
            ],
            imports: [
                RouterTestingModule,
                RatingModule,
                FormsModule,
            ],
        } )
            .compileComponents();
    } );

    beforeEach( () => {
        fixture = TestBed.createComponent( BookReviewShowComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
