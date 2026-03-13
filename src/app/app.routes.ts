import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationComponent } from './features/notification/notification.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';
import { DetailsComponent } from './features/details/details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Sign In | Route Posts' },
      { path: 'register', component: RegisterComponent, title: 'Create Account | Route Posts' },
      {
        path: 'forget',
        component: ForgetPasswordComponent,
        title: 'Forget Password | Route Posts',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'feed', component: FeedComponent, title: 'Feed | Route Posts' },
      { path: 'profile', component: ProfileComponent, title: 'Profile | Route Posts' },
      {
        path: 'notifications',
        component: NotificationComponent,
        title: 'Notifications | Route Posts',
      },
      {
        path: 'change',
        component: ChangePasswordComponent,
        title: 'Change Password | Route Posts',
      },
      {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Post Details | Route Posts',
      },
    ],
  },
  { path: '**', component: NotFoundComponent, title: '404 | Route Posts' },
];
