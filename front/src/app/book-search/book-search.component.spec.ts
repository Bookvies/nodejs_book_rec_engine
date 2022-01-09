import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RatingModule } from 'ng-starrating';
import { AppRoutingModule } from '../app-routing.module';
import { BaseComponent } from '../base/base.component';
import { BookRecommendationComponent } from '../book-recommendation/book-recommendation.component';
import { BookReviewShowComponent } from '../book-review-show/book-review-show.component';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { UserComponent } from '../user/user.component';

import { BookSearchComponent } from './book-search.component';

describe( 'BookSearchComponent', () => {
    let component: BookSearchComponent;
    let fixture: ComponentFixture<BookSearchComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                LoginComponent,
                RegisterComponent,
                BaseComponent,
                HeaderComponent,
                UserComponent,
                BookSearchComponent,
                BookReviewShowComponent,
                BookRecommendationComponent,
            ],
            imports: [
                BrowserModule,
                AppRoutingModule,
                FormsModule,
                RatingModule,
            ],
        } )
            .compileComponents();
    } );

    beforeEach( () => {
        fixture = TestBed.createComponent( BookSearchComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
