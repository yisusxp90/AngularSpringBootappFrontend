import {Region} from './Region';
import {Factura} from "./Factura";

export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: string;
  email: string;
  foto: string;
  region: Region;
  facturas: Factura[] = [];
}
