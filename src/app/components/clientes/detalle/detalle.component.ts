import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../../../model/Cliente';
import {ClienteService} from '../../../services/cliente.service';
import {ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {ModalService} from '../../../services/modal.service';
import {AuthService} from '../../../services/auth.service';
import {Factura} from '../../../model/Factura';
import {FacturaService} from '../../../services/factura.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input()
  private cliente: Cliente;
  page: string;
  titulo: string = 'Detalle del Cliente';
  private imagenSeleccionada: File;
  progreso: number = 0;
  modalService: ModalService;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              modalService: ModalService,
              private authService: AuthService,
              private facturaService: FacturaService) { this.modalService = modalService }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      /* const id = params.get('id');
      if (id) {
        this.clienteService.obtenerCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }*/
    });
  }

  seleccionarFoto(event) {
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.imagenSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error: upload', 'Debe seleccionar un tipo de foto valido', 'error');
      this.imagenSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.imagenSeleccionada) {
      swal.fire('Error: upload', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.imagenSeleccionada, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificacion.emit(this.cliente);
            swal.fire('Foto subido exitosamente!', `La foto se ha subido exitosamente: ${response.mensaje}`, 'success');
          }
        });
    }

  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.imagenSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura) {
    swal.fire({
      title: 'Eliminar Factura',
      text: `La factura sera eliminada, Esta seguro ?`,
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
        this.facturaService.delete(factura.id)
          .subscribe( () => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
            swal.fire(
              'Factura eliminada!',
              'Factura eleminada exitosamente.',
              'success'
            );
          });
      }
    });
  }

}
