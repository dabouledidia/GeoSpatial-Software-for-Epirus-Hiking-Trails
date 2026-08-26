import { provideRouter, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Updated import
import { CreateTrail } from './create-trail/create-trail';
import { MainPage } from './main-page/main-page';
import { TrailList } from './trail-list/trail-list';
import { Logout } from './logout/logout';
import { CreateReview } from './create-review/create-review';
import { ReviewList } from './review-list/review-list';
import { UserManagement } from './user-management/user-management';
// Import the guard
import { authGuard } from './guards/auth.guard'; 
import { Profile } from './profile/profile';
import { ExploreTrails } from './explore-trails/explore-trails';
import { TrailPage } from './trail/trail';
import { TrailMapComponent } from './trail-map-editor/trail-map-editor';


export const routes: Routes = [
    {path: '', redirectTo: 'main-page', pathMatch: 'full'},
    
    // Public Routes
    {path: 'main-page', component: MainPage},
    {path: 'trail-list', component: TrailList},
    {path: 'review-list', component: ReviewList},
    {path: 'review-list/:id', component: ReviewList},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'explore-trails', component: ExploreTrails},
    {path: 'trail-page/:id', component: TrailPage},
    {path: 'trail/:id/map-editor', component: TrailMapComponent},


    
    // Protected Routes (Apply canActivate)
    {path: 'logout', component: Logout, canActivate: [authGuard]},
    {path: 'profile', component: Profile, canActivate: [authGuard]},
    {path: 'create-trail', component: CreateTrail, canActivate: [authGuard]},
    {path: 'create-review/:id', component: CreateReview, canActivate: [authGuard]},
    {path: 'user-management', component: UserManagement, canActivate: [authGuard]}
];

export const AppRoutes = provideRouter(routes);

bootstrapApplication(App, {
    providers: [
        AppRoutes,
        provideHttpClient(withInterceptorsFromDi()) 
    ]
});