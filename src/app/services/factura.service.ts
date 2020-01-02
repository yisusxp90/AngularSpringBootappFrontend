import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Factura} from '../model/Factura';

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
}
