import { Injectable } from '@angular/core';
import {Cliente} from '../model/Cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private url: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  cargarClientes(page: string): Observable<any> {
    const urlEndPoint = this.url + `/api/listar/page/${page}`;
    return this.httpClient.get(urlEndPoint).pipe(
      map(resp => {
      return resp;
    }));
  }

  crear(cliente: Cliente): Observable<Cliente> {
    const urlEndPoint = this.url + '/api/clientes/crear';
    return this.httpClient.post(urlEndPoint, cliente).pipe(map(resp => resp as Cliente),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  obtenerCliente(id): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/listar/${id}`;
    return this.httpClient.get(urlEndPoint)
      .pipe(map(resp => resp as Cliente),
        catchError(e => {
          if (e.status !== 401 && e.error.mensaje) {
            this.router.navigate(['/clientes']);
            console.log(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  actualizar(cliente: Cliente): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/clientes/actualizar/${cliente.id}`;
    return this.httpClient.put(urlEndPoint, cliente).pipe(map(resp => resp as Cliente),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        return throwError(e);
      }));
  }

  eliminar(id): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/clientes/borrar/${id}`;
    return this.httpClient.delete<Cliente>(urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      }));
  }

  subirFoto(archivo: File, id) {
    const urlEndPoint = this.url + '/api/clientes/upload';
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    let httpHeaders = new HttpHeaders();
    const token = this.authService.getToken();
    if (token !== null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST', urlEndPoint, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.httpClient.request(req);
  }

  getRegiones(): Observable<any> {
    const urlEndPoint = this.url + '/api/clientes/regiones';
    return this.httpClient.get(urlEndPoint).pipe(
      map(resp => {
        return resp;
      }));
  }

  filtrarClientes(termino: string): Observable<Cliente[]> {
    const url = this.url + `/api/clientes/filtrar-clientes/${termino}`;
    return this.httpClient.get<Cliente[]>(url);
  }

}
