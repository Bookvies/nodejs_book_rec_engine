import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { RegisterComponent } from './register/register.component';
import { TranslateUniversalLoaderService } from './translate-universal-loader.service';

describe( 'AppComponent', () => {
    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                AppComponent,
                BaseComponent,
                NotificationComponent,
                LoginComponent,
                RegisterComponent,
            ],
            imports: [
                AppRoutingModule,
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
