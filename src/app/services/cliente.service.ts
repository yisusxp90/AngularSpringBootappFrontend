import { Injectable } from '@angular/core';
import {Cliente} from '../model/Cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private url: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient, private router: Router) { }

  cargarClientes(page: string): Observable<any> {
    const urlEndPoint = this.url + `/api/listar/page/${page}`;
    return this.httpClient.get(urlEndPoint).pipe(
      map(resp => {
      return resp;
    }));
  }

  crear(cliente: Cliente): Observable<Cliente> {
    const urlEndPoint = this.url + '/api/crear';
    return this.httpClient.post(urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(map(resp => resp as Cliente),
      catchError(e => {
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
    return this.httpClient.get(urlEndPoint)
      .pipe(map(resp => resp as Cliente),
        catchError(e => {
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
          swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(e);
        }));
  }

  actualizar(cliente: Cliente): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/actualizar/${cliente.id}`;
    return this.httpClient.put(urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(map(resp => resp as Cliente),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      }));
  }

  eliminar(id): Observable<Cliente> {
    const urlEndPoint = this.url + `/api/borrar/${id}`;
    return this.httpClient.delete<Cliente>(urlEndPoint, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.mensaje, 'error');
        return throwError(e);
      }));
  }

  subirFoto(archivo: File, id) {
    const urlEndPoint = this.url + '/api/clientes/upload';
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST', urlEndPoint, formData, {
      reportProgress: true
    });
    return this.httpClient.request(req);
  }

}
