import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RatingModule } from 'ng-starrating';
import { AppRoutingModule } from '../app-routing.module';
import { BaseComponent } from '../base/base.component';
import { BookRecommendationComponent } from '../book-recommendation/book-recommendation.component';
import { BookReviewShowComponent } from '../book-review-show/book-review-show.component';
import { BookSearchComponent } from '../book-search/book-search.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { TranslateUniversalLoaderService } from '../translate-universal-loader.service';
import { UserComponent } from '../user/user.component';

import { HeaderComponent } from './header.component';

describe( 'HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                LoginComponent,
                RegisterComponent,
                BaseComponent,
                UserComponent,
                HeaderComponent,
                BookSearchComponent,
                BookReviewShowComponent,
                BookRecommendationComponent,
            ],
            imports: [
                BrowserModule,
                AppRoutingModule,
                FormsModule,
                RatingModule,
                TranslateModule.forRoot( {
                    defaultLanguage: 'en',
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateUniversalLoaderService,
                    },
                } ),
            ],
        } )
            .compileComponents();
    } );

    beforeEach( () => {
        fixture = TestBed.createComponent( HeaderComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
