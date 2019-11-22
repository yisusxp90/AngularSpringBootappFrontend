import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../../model/Cliente';
import {ClienteService} from '../../services/cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: []
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo: string = 'Crear Cliente';
  private errores: string[];
  page: string;
  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
      this.activatedRoute.params.subscribe(params => {
        const id = params['id'];
        this.page = params['page'];
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
    this.clienteService.actualizar(this.cliente).subscribe((resp: any) => {
      swal.fire('Cliente Actualizado', `El cliente ${resp.cliente.nombre} ha sido actualizado exitosamente!`, 'success');
      this.router.navigate(['/clientes/page/', this.page]);
    }, err => {
      this.errores = err.error.errors;
    });
  }

}
