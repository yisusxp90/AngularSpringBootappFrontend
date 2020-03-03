import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../../model/Cliente';
import {ClienteService} from '../../services/cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { Region } from '../../model/Region';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: []
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  clienteSeleccionado: Cliente;
  tituloAccion: string;
  imagenSeleccionada: File;
  progreso: number = 0;
  errores: string[];
  regiones: Region[];
  page: string;
  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute,
    private modalService: ModalService ) { }

  ngOnInit() {   
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe( regiones => {
      this.regiones = regiones;
    });    
  }
  
  cargarCliente(): void {
      this.activatedRoute.params.subscribe(params => {
        const id = params.id;
        this.page = params.page;
        
        if (id) {          
          this.tituloAccion = 'Modificar';          
          this.clienteService.obtenerCliente(id).subscribe(cliente => this.cliente = cliente);          
        }
        else this.tituloAccion = 'Crear';
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
            swal.fire('Foto subida exitosamente!', `La foto se ha subido exitosamente: ${response.mensaje}`, 'success');
          }
        });
    }
  }

  public crear(): void {
    this.clienteService.crear(this.cliente).subscribe((resp: any) => {
      swal.fire('Cliente Registrado', `El cliente ${resp.cliente.nombre} ha sido registrado exitosamente!`, 'success');
      this.router.navigate(['/clientes/page/', this.page]);
    }, err => {
      this.errores = err.error.errors;
    });
  }

  public actualizar(): void {
    this.cliente.facturas = null;
    this.clienteService.actualizar(this.cliente).subscribe((resp: any) => {
      swal.fire('Cliente Actualizado', `El cliente ${resp.cliente.nombre} ha sido actualizado exitosamente!`, 'success');
      this.router.navigate(['/clientes/page/', this.page]);
    }, err => {
      this.errores = err.error.errors;
    });
  }

  compararRegion(o1: Region, o2: Region) {
    if (o1 && o2) {
      return o1.id === o2.id;
    }
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return false;
  }

}
