import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';


@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate, CanActivateChild {
  currentUser: User;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if(this.authService.isLoggedIn){
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    if( (url.includes('/menu/empresas') && this.currentUser.type != 1) ){
      this.router.navigate(['/menu']);
      return false;
    }

    return this.checkLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(): boolean {  
    if (this.authService.isLoggedIn) {
      return true;
    }
    
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
