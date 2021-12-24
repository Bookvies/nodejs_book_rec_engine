import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from '../app-routing.module';
import { BaseComponent } from '../base/base.component';
import { LoginComponent } from '../login/login.component';
import { TranslateUniversalLoaderService } from '../translate-universal-loader.service';

import { RegisterComponent } from './register.component';

describe( 'RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

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
        fixture = TestBed.createComponent( RegisterComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
