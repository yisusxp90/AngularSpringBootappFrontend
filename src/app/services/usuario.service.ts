import { Injectable } from '@angular/core';
import {Usuario} from '../model/Usuario';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private url: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  cargarUsuarios(page: string): Observable<any> {
    const urlEndPoint = this.url + `/api/usuarios/page/${page}`;
    return this.httpClient.get(urlEndPoint).pipe(
      map(resp => {
      return resp;
    }));
  }

  crear(usuario: Usuario): Observable<Usuario> {
    const urlEndPoint = this.url + '/api/usuario/crear';
    return this.httpClient.post(urlEndPoint, usuario).pipe(map(resp => resp as Usuario),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }        
        return throwError(e);
      }));
  }

  obtenerUsuario(id): Observable<Usuario> {
    const urlEndPoint = this.url + `/api/usuario/${id}`;
    return this.httpClient.get(urlEndPoint)
      .pipe(map(resp => resp as Usuario),
        catchError(e => {
          if (e.status !== 401 && e.error.mensaje) {
            this.router.navigate(['/usuarios']);
            console.log(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  actualizar(usuario: Usuario): Observable<Usuario> {
    const urlEndPoint = this.url + `/api/usuario/actualizar/${usuario.id}`;
    return this.httpClient.put(urlEndPoint, usuario).pipe(map(resp => resp as Usuario),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        return throwError(e);
      }));
  }

  eliminar(id): Observable<Usuario> {
    const urlEndPoint = this.url + `/api/usuario/borrar/${id}`;
    return this.httpClient.delete<Usuario>(urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      }));
  }
/* 

filtrarUsuarios(termino: string): Observable<Usuario[]> {
  const url = this.url + `/api/usuarios/filtrar-usuarios/${termino}`;
  return this.httpClient.get<Usuario[]>(url);
} 
 
  getRegiones(): Observable<any> {
    const urlEndPoint = this.url + '/api/clientes/regiones';
    return this.httpClient.get(urlEndPoint).pipe(
      map(resp => {
        return resp;
      }));
  }
*/

}
