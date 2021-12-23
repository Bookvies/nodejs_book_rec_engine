import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from '../app-routing.module';
import { BaseComponent } from '../base/base.component';
import { RegisterComponent } from '../register/register.component';
import { TranslateUniversalLoaderService } from '../translate-universal-loader.service';

import { LoginComponent } from './login.component';

describe( 'LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                LoginComponent,
                RegisterComponent,
                BaseComponent,
            ],
            imports: [
                BrowserModule,
                AppRoutingModule,
                FormsModule,
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
        fixture = TestBed.createComponent( LoginComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
