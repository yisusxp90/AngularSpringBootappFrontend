import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../model/Usuario';
import {UsuarioService} from '../../services/usuario.service';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: []
})
export class RegistroComponent implements OnInit {

  private usuario: Usuario = new Usuario();
  private titulo: string = 'Crear Usuario';
  private errores: string[];
  page: string;
  constructor(private authService: AuthService,private usuarioService: UsuarioService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {    
    this.cargarUsuario();
    // TODO cargar roles y setear el del user

   /*  this.usuarioService.getRegiones().subscribe( regiones => {
      this.regiones = regiones;
    }); */
  }

  cargarUsuario(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      this.page = params.page;
      if (id) {
        this.usuarioService.obtenerUsuario(id).subscribe(usuario => this.usuario = usuario);
      }
    });
  }

  registro(): void { }

  public crear(): void {
    this.usuarioService.crear(this.usuario).subscribe((resp: any) => {
      swal.fire('Usuario Registrado', `El usuario ${resp.usuario.username} ha sido registrado exitosamente!`, 'success');
    }, err => {
      this.errores = err.error.errors;
    });
    
    this.usuario.apellido = this.usuario.nombre = this.usuario.password = this.usuario.email = this.usuario.username = null;
  }

  public actualizar(): void {
    this.usuario.roles = null;
    console.log(this.usuario.enabled);
    this.usuarioService.actualizar(this.usuario).subscribe((resp: any) => {
      swal.fire('Usuario Actualizado', `El usuario ${resp.usuario.username} ha sido actualizado exitosamente!`, 'success');
      this.router.navigate(['/usuarios/page/', this.page]);
    }, err => {
      this.errores = err.error.errors;
    });
  }

 /*  compararRegion(o1: Region, o2: Region) {
    if (o1 && o2) {
      return o1.id === o2.id;
    }
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return false;
  } */

}
