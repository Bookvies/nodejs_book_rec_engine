import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BookSearchComponent } from '../book-search/book-search.component';
import { TranslateUniversalLoaderService } from '../translate-universal-loader.service';

import { BaseComponent } from './base.component';

describe( 'BaseComponent', () => {
    let component: BaseComponent;
    let fixture: ComponentFixture<BaseComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [
                BaseComponent,
                BookSearchComponent,
            ],
            imports: [
                FormsModule,
                TranslateModule.forRoot( {
                    defaultLanguage: 'en',
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateUniversalLoaderService,
                    },
                } ),
            ],
            providers: [],
        } )
            .compileComponents();
    } );

    beforeEach( () => {
        fixture = TestBed.createComponent( BaseComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
