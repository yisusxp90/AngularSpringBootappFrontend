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

  calcularTotalFactura(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
