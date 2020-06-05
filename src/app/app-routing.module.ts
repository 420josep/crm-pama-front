import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
  { 
    path: 'menu',
    loadChildren: './components/home/home.module#HomeModule',
    canActivate: [AuthGuard],
  },
  { path: '', loadChildren: "./components/auth/auth.module#AuthModule"},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
