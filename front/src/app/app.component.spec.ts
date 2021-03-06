import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RatingModule } from 'ng-starrating';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { BookRecommendationComponent } from './book-recommendation/book-recommendation.component';
import { BookReviewShowComponent } from './book-review-show/book-review-show.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { RegisterComponent } from './register/register.component';
import { TranslateUniversalLoaderService } from './translate-universal-loader.service';
import { UserComponent } from './user/user.component';

describe( 'AppComponent', () => {
    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                AppComponent,
                BaseComponent,
                NotificationComponent,
                LoginComponent,
                RegisterComponent,
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
        } ).compileComponents();
    } );

    it( 'should create the app', () => {
        const fixture = TestBed.createComponent( AppComponent );
        const app = fixture.componentInstance;
        expect( app ).toBeTruthy();
    } );

    it( `should have as title 'front'`, () => {
        const fixture = TestBed.createComponent( AppComponent );
        const app = fixture.componentInstance;
        expect( app.title ).toEqual( 'front' );
    } );

    it( 'should render router outlet', () => {
        const fixture = TestBed.createComponent( AppComponent );
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect( compiled.querySelector( 'router-outlet' ) )
            .toBeTruthy();
    } );
} );
