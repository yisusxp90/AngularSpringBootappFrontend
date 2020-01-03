import { Component, OnInit } from '@angular/core';
import {Factura} from '../../model/Factura';
import {ClienteService} from '../../services/cliente.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {FacturaService} from '../../services/factura.service';
import {Producto} from '../../model/Producto';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: []
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();
  page: string;
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService) { }

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

}
