import { Injectable } from '@angular/core';
import {Rol} from '../model/Rol';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private url: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  cargarRoles(): Observable<any> {
    const urlEndPoint = this.url + `/api/roles`;
    return this.httpClient.get(urlEndPoint).pipe(map(resp => {
      return resp;
    }));
  }
/*
  crear(usuario: Rol): Observable<Rol> {
    const urlEndPoint = this.url + '/api/rol/crear';
    return this.httpClient.post(urlEndPoint, usuario).pipe(map(resp => resp as Rol),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }        
        return throwError(e);
      }));
  }

  obtenerUsuario(id): Observable<Rol> {
    const urlEndPoint = this.url + `/api/rol/${id}`;
    return this.httpClient.get(urlEndPoint)
      .pipe(map(resp => resp as Rol),
        catchError(e => {
          if (e.status !== 401 && e.error.mensaje) {
            this.router.navigate(['/rol']);
            console.log(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  actualizar(rol: Rol): Observable<Rol> {
    const urlEndPoint = this.url + `/api/rol/actualizar/${rol.id}`;
    return this.httpClient.put(urlEndPoint, rol).pipe(map(resp => resp as Rol),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        return throwError(e);
      }));
  }

  eliminar(id): Observable<Rol> {
    const urlEndPoint = this.url + `/api/rol/borrar/${id}`;
    return this.httpClient.delete<Rol>(urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      }));
  }
*/

}
