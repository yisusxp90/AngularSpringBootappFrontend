import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private route: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      const payload = this.authService.obtenerDatosToken(token);
      const now = new Date().getTime() / 1000;
      if (payload.exp >= now) {
        return true;
      }
      
      this.authService.logout(); // si el token expira      
    }
    this.route.navigate(['/login']);
    return false;
  }
}
