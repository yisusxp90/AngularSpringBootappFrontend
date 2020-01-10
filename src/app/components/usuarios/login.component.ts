import { Component, OnInit } from '@angular/core';
import {Usuario} from '../../model/Usuario';
import swal from 'sweetalert2';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Sign In!';
  usuario: Usuario;
  constructor(private authService: AuthService, private route: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  login(): void {
    if (!this.usuario.username || !this.usuario.password) {
      swal.fire('Error Login', 'Username o password vacio!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(resp => {
      this.authService.guardarUsuario(resp.access_token);
      this.authService.guardarToken(resp.access_token);
      const usuario = this.authService.getUsuario();
      this.route.navigate(['/clientes']);
      swal.fire('Login', `Hola ${usuario.username}, has iniciado sesion` , 'success');
    }, err => {
      if (err.status === 400) {
        swal.fire('Error Login', 'Username o password invalido!', 'error');
      } else {
        swal.fire('Error Login', 'Error General', 'error');
      }
    });
  }
}
