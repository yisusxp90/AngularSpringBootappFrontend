import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../../services/auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private route: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.isAuthenticated()) {
      this.route.navigate(['/']);
      return false;
    }

    const role = next.data['role'] as string;
    console.log(role);
    if (this.authService.hasRole(role)) {
      return true;
    }
    swal.fire('Acceso denegado', 'No tienes acceso a este recurso', 'warning');
    this.route.navigate(['/clientes']);
    return false;
  }
}
