import { Rol } from './Rol';

export class Usuario {

  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  enabled: boolean;
  roles: Rol[] = [];
}
