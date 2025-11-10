import { provideRouter, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { CreateTrail } from './create-trail/create-trail';
import { MainPage } from './main-page/main-page';
import { TrailList } from './trail-list/trail-list';
import { Logout } from './logout/logout';

export const routes: Routes = [
    {path: '', redirectTo: 'main-page', pathMatch: 'full'},
    {path: 'trail-list', component: TrailList},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'logout', component: Logout},
    {path: 'create-trail', component: CreateTrail},
    {path: 'main-page', component: MainPage}
];

export const AppRoutes = provideRouter(routes);


bootstrapApplication(App, {
    providers: [AppRoutes,
        provideHttpClient()
    ]
});
