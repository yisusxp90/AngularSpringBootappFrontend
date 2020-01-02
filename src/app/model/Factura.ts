import {ItemFactura} from "./ItemFactura";
import {Cliente} from "./Cliente";

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: ItemFactura[] = [];
  cliente: Cliente;
  total: number;
  createAt: string;
}
