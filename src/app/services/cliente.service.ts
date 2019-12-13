import { Injectable } from '@angular/core';
import {Cliente} from '../model/Cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {Region} from '../model/Region';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private url: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  private agregarAuthorizationHeader() {
      const token = this.authService.getToken();
      if (token !== null) {
        return this.httpHeaders.append('Authorization', 'Bearer ' + token);
      }
      return this.httpHeaders;
  }

  cargarClientes(page: string): Observable<any> {
    const urlEndPoint = this.url + `/api/listar/page/${page}`;
    return this.httpClient.get(urlEndPoint).pipe(
      map(resp => {
      return resp;
    }));
  }

  crear(cliente: Cliente): Observable<Cliente> {
    const urlEndPoint = this.url + '/api/clientes/crear';
    return this.httpClient.post(urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(map(resp => resp as Cliente),
      catchError(e => {
        if (this.isUnauthorized(e)) {
          return throwError(e);
        }
        if (e.status === 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      }));
  }

  obtenerCliente(id): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/listar/${id}`;
    return this.httpClient.get(urlEndPoint, {headers: this.agregarAuthorizationHeader()})
      .pipe(map(resp => resp as Cliente),
        catchError(e => {
          if (this.isUnauthorized(e)) {
            return throwError(e);
          }
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
          swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(e);
        }));
  }

  actualizar(cliente: Cliente): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/clientes/actualizar/${cliente.id}`;
    return this.httpClient.put(urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(map(resp => resp as Cliente),
      catchError(e => {
        if (this.isUnauthorized(e)) {
          return throwError(e);
        }
        if (e.status === 400) {
          return throwError(e);
        }
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      }));
  }

  eliminar(id): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/clientes/borrar/${id}`;
    return this.httpClient.delete<Cliente>(urlEndPoint, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isUnauthorized(e)) {
          return throwError(e);
        }
        swal.fire(e.error.mensaje, e.error.mensaje, 'error');
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
    return this.httpClient.request(req).pipe(
      catchError(e => {
        this.isUnauthorized(e);
        return throwError(e);
    }));
  }

  getRegiones(): Observable<any> {
    const urlEndPoint = this.url + '/api/clientes/regiones';
    return this.httpClient.get(urlEndPoint, {headers: this.agregarAuthorizationHeader()}).pipe(
      map(resp => {
        return resp;
      }), catchError(e => {
        this.isUnauthorized(e);
        return throwError(e);
      }));
  }

  private isUnauthorized(e): boolean {
    if (e.status === 401) {
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status === 403) {
      swal.fire('Acceso denegado', 'No tienes acceso a este recurso', 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }

}
