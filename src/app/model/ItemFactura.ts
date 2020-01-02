import {Producto} from "./Producto";

export class ItemFactura {
  producto: Producto;
  cantidad: number = 1;
  importe: number;
}
