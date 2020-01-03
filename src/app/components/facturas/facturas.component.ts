import { Component, OnInit } from '@angular/core';
import {Factura} from '../../model/Factura';
import {ClienteService} from '../../services/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {FacturaService} from '../../services/factura.service';
import {Producto} from '../../model/Producto';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFactura} from '../../model/ItemFactura';
import swal from "sweetalert2";

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: []
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();
  page: string;
  private errores: string[];
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const clienteId = params.get('clienteId');
      this.page = params.get('page');
      this.clienteService.obtenerCliente(clienteId).subscribe( cliente => {
        this.factura.cliente = cliente;
      });
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    const existe = this.existeItem(producto.id);
    if (existe) {
      this.incrementarCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;
    if (cantidad <= 0) {
      this.eliminarItem(id);
      return;
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number) {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++ item.cantidad;
      }
      return item;
    });
  }

  eliminarItem(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => {
      return id !== item.producto.id;
    });
  }

  create(facturaForm): void {

    if (this.factura.items.length <= 0) {
      this.autocompleteControl.setErrors({'invalid': true});
      return;
    }
    if (facturaForm.form.valid || this.factura.items.length > 0) {
      this.facturaService.create(this.factura).subscribe(factura => {
        swal.fire('Factura Registrada', `La factura ha sido registrado exitosamente!`, 'success');
        this.router.navigate(['/clientes/page/', this.page]);
      }, err => {
        this.errores = err.error.errors;
      });
    }
  }

}
