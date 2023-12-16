import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  if (
    authService.isLoggedIn ||
    (localStorage.getItem('user') && localStorage.getItem('user') !== 'null')
  ) {
    return true;
  } else {
    router.navigate(['/login']);
    
    return false;
  }
}
