import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  authService: AuthService;

  constructor(authService: AuthService, private route: Router)
  {
    this.authService = authService;
  }

  ngOnInit() {
  }

  logout(): void {
    this.authService.logout();
    swal.fire('Logout', `Has cerrado sesion correctamente` , 'success');
  }

}
