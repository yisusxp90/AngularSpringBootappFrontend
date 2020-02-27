import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../../model/Cliente';
import {ClienteService} from '../../services/cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {Region} from '../../model/Region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: []
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  titulo: string = 'Crear Cliente';
  errores: string[];
  regiones: Region[];
  page: string;
  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

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
          this.clienteService.obtenerCliente(id).subscribe(cliente => this.cliente = cliente);
        }
      });
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
