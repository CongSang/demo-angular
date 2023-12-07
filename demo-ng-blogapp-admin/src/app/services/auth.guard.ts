import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isLoggedIn: boolean = true;

  constructor(private authService: AuthService, private router: Router, private location: Location) {
    this.isLoggedIn = !!localStorage.getItem('user');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (state.url !== '/login') {
        if (this.isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/login']);
          
          return false;
        }
      } else {
        if (this.isLoggedIn) {
          this.location.back();
          
          return false;
        } else {
          return true;
        }
      }
      
  }
  
}
