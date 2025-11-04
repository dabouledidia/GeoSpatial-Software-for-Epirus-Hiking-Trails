import { provideRouter, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'register', component: Register}
];

export const AppRoutes = provideRouter(routes);


bootstrapApplication(App, {
    providers: [AppRoutes,
        provideHttpClient()
    ]
});
