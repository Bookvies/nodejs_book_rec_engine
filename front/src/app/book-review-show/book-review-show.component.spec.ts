import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReviewShowComponent } from './book-review-show.component';

describe( 'BookReviewShowComponent', () => {
    let component: BookReviewShowComponent;
    let fixture: ComponentFixture<BookReviewShowComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [BookReviewShowComponent],
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
