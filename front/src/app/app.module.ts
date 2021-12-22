import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { AppRoutingModule } from './app-routing.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateUniversalLoaderService } from './translate-universal-loader.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './notification/notification.component';
import { HttpServiceService } from './http-service.service';


@NgModule( {
    declarations: [
        AppComponent,
        BaseComponent,
        NotificationComponent,
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
    providers: [HttpServiceService],
    bootstrap: [AppComponent],
} )
// eslint-disable-next-line require-jsdoc
export class AppModule { }
