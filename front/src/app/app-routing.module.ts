import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    // declare routes
    { path: '', component: BaseComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];

// eslint-disable-next-line new-cap
@NgModule( {
    imports: [RouterModule.forRoot( routes, { useHash: true } )],
    exports: [RouterModule],
} )
// eslint-disable-next-line require-jsdoc
export class AppRoutingModule { }
