import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Factura} from '../model/Factura';
import {Producto} from '../model/Producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private url: string = 'http://localhost:8080/api/facturas';
  constructor(private httpClient: HttpClient) { }

  getFactura(id: number): Observable<Factura> {
    const url = this.url + `/${id}`;
    return this.httpClient.get<Factura>(url);
  }

  delete(id: number): Observable<void> {
    const url = this.url + `/${id}`;
    return this.httpClient.delete<void>(url);
  }

  filtrarProductos(termino: string): Observable<Producto[]> {
    const url = this.url + `/filtrar-productos/${termino}`;
    return this.httpClient.get<Producto[]>(url);
  }
}
