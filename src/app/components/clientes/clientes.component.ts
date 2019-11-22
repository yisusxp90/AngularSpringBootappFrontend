import { Component, OnInit } from '@angular/core';
import {Cliente} from '../../model/Cliente';
import {ClienteService} from '../../services/cliente.service';
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  paginador: any;
  page: string;
  clienteSeleccionado: Cliente;
  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: ModalService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: string = params.get('page');
      if (!page) {
        page = '0';
      }
      this.page = page;
      this.clienteService.cargarClientes(page)
        .subscribe(resp => {
          this.clientes = resp.content;
          this.paginador = resp;
        });
    });
    this.modalService.notificacion.subscribe(cliente => {
      this.clientes = this.clientes.map( clienteOriginal => {
        if (cliente.id === clienteOriginal.id) {
          console.log('evento emit de foto: ' + cliente.foto);
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  eliminar(cliente: Cliente): void {
    swal.fire({
      title: 'Eliminar Cliente',
      text: `El cliente ${cliente.nombre} sera eliminado, Esta seguro ?`,
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
        this.clienteService.eliminar(cliente.id)
          .subscribe( () => {
              this.clientes = this.clientes.filter(cl => cl !== cliente);
              swal.fire(
                'Cliente eliminado!',
                'Cliente eleminado exitosamente.',
                'success'
              );
              this.ngOnInit();
              if (this.clientes.length === 0 && this.page !== '0') {
                this.router.navigate(['/clientes/page/', Number(this.page) - 1]);
              }
          });
      }
    });
  }

  detalle(id: string) {
    this.router.navigate(['/clientes/ver/', id, this.page]);
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

  cerrarModal() {
    this.modalService.cerrarModal();
  }

}
