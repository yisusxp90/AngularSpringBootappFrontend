import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario} from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuario: Usuario;
  private token: string;
  private url: string = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  public getUsuario(): Usuario {
    if (this.usuario != null) {
      return this.usuario;
    } else if (this.usuario == null && sessionStorage.getItem('usuario') != null) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this.usuario;
    }
    return new Usuario();
  }

  public getToken(): string {
    if (this.token != null) {
      return this.token;
    } else if (this.token == null && sessionStorage.getItem('token') != null) {
      this.token = sessionStorage.getItem('token');
      return this.token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const url = this.url + '/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.httpClient.post(url, params.toString(), {headers: httpHeaders});
  }

  guardarUsuario(accessToken: string) {
    const payload = this.obtenerDatosToken(accessToken);

    this.usuario = new Usuario();
    this.usuario.username = payload.user_name;
    this.usuario.nombre = payload.nombre;
    this.usuario.apellido = payload.apellido;
    this.usuario.email = payload.email;
    this.usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  guardarToken(accessToken: string) {
    this.token = accessToken;
    sessionStorage.setItem('token', this.token);
  }

  obtenerDatosToken(accessToken: string) {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    const payload = this.obtenerDatosToken(this.getToken());
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.clear();
    this.token = null;
    this.usuario = null;
  }

  hasRole(role: string): boolean {
    if (this.usuario != null) {
      if (this.usuario.roles.includes(role)) {
        return true;
      }
    }
    return false;
  }
}

