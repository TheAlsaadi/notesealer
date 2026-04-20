import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import("./home/home").then(m => m.Home)
  },
  {
    path: 'note-editor',
    canActivate: [authGuard],
    loadComponent: () => import("./note-editor/note-editor").then(m => m.NoteEditor)
  },
  {
    path: 'note-editor/:id',
    canActivate: [authGuard],
    loadComponent: () => import("./note-editor/note-editor").then(m => m.NoteEditor)
  },
  {
    path: 'login',
    loadComponent: () => import("./login/login").then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import("./register/register").then(m => m.Register)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import("./forgot-your-password/forgot-your-password").then(m => m.ForgotYourPassword)
  },
  {
    path: 'reset-password',
    canActivate: [authGuard],
    loadComponent: () => import("./reset-password/reset-password").then(m => m.ResetPassword)
  },
  { path: '**', redirectTo: 'login' }
];
