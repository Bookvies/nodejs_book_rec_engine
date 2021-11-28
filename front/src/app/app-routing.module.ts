import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';

const routes: Routes = [
    // declare routes
    { path: '', component: BaseComponent },
];

// eslint-disable-next-line new-cap
@NgModule( {
    imports: [RouterModule.forRoot( routes, { useHash: true } )],
    exports: [RouterModule],
} )
// eslint-disable-next-line require-jsdoc
export class AppRoutingModule { }
