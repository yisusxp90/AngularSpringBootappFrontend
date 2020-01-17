import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../model/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Rol } from 'src/app/model/Rol';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: []
})
export class RegistroComponent implements OnInit {

  private usuario: Usuario = new Usuario();
  private titulo: string = 'Crear Usuario';
  private errores: string[];
  private roles: Rol[];
  page: string;
  constructor(private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private rolService: RolService) { }

  ngOnInit() {    
    this.cargarRoles();
    this.cargarUsuario();
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
    this.roles.filter(r => r.checked !== null);
    let roles = this.roles; 
    let usrRoles: Rol[] = [];
    usrRoles.push(...this.usuario.roles); // clone

    this.procesaCheckboxes(roles, usrRoles);
   
    this.usuario.roles = usrRoles;
    // console.log(JSON.stringify(userRoles));   

    this.usuarioService.actualizar(this.usuario).subscribe((resp: any) => {
      swal.fire('Usuario Actualizado', `El usuario ${resp.usuario.username} ha sido actualizado exitosamente!`, 'success');
      this.router.navigate(['/usuarios/page/', this.page]);
    }, err => {
      this.errores = err.error.errors;
    });
  }

  private procesaCheckboxes(roles: Rol[], usrRoles: Rol[]) {
    for (let i = 0; i < roles.length; i++) {
      let found = false;
      const rol = roles[i];
      for (let j = 0; j < usrRoles.length; j++) {
        if (usrRoles[j].id === rol.id) {
          found = true;
          if (rol.checked === false) {
            usrRoles.splice(usrRoles.findIndex(r => r.id === rol.id), 1); // delete
          }
        }
      }
      if (found === false && rol.checked === true)
        usrRoles.push(rol);
    }
  }

  cargarRoles(): void {
    this.rolService.cargarRoles().subscribe(roles => this.roles = roles);
  }

  checked(id: number): boolean {
   return this.usuario.roles.some(r => r.id === id);
  }
}
