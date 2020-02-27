import { Component, OnInit } from '@angular/core';
import {Usuario} from '../../model/Usuario';
import {UsuarioService} from '../../services/usuario.service';
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../services/modal.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  paginador: any;
  page: string;
  termino: string = null;
  usuarioSeleccionado: Usuario;
  authService: AuthService;

  constructor(private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: ModalService,
              authService: AuthService) { this.authService = authService }

  ngOnInit() {
    this.listar();    
  }

  private listar() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: string = params.get('page');
      if (!page || page === 'undefined') {
        page = '0';
      }
      this.page = page;
      this.usuarioService.cargarUsuarios(page)
        .subscribe(resp => {
          this.usuarios = resp.content;
          this.paginador = resp;
        });
    });
  }

  eliminar(usuario: Usuario): void {
    swal.fire({
      title: 'Eliminar Usuario',
      text: `El usuario ${usuario.nombre} sera eliminado, Esta seguro ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (!result) {
        return;
      }
      if (result.value) {
        this.usuarioService.eliminar(usuario.id)
          .subscribe( () => {
              this.usuarios = this.usuarios.filter(cl => cl !== usuario);
              swal.fire(
                'Usuario eliminado!',
                'Usuario eliminado exitosamente.',
                'success'
              );
              this.ngOnInit();
              if (this.usuarios.length === 0 && this.page !== '0') {
                this.router.navigate(['/usuarios/page/', Number(this.page) - 1]);
              }
          });
      }
    });
  }

  abrirModal(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modalService.abrirModal();
  }

  cerrarModal() {
    this.modalService.cerrarModal();
  }
/*
  buscarUsuario() {
    if(this.termino !== null){
      this.usuarioService.filtrarUsuarios(this.termino).subscribe(usuarios => {
        this.usuarios = usuarios;
        this.termino = null;
        this.paginador = '';
      });
    } else {
      this.ngOnInit();
    }
  }
*/
}
