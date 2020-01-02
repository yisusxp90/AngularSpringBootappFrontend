import { Component, OnInit } from '@angular/core';
import {FacturaService} from "../../services/factura.service";
import {Factura} from "../../model/Factura";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: []
})
export class DetalleFacturaComponent implements OnInit {

  constructor(private facturaService: FacturaService, private activatedRoute: ActivatedRoute) { }

  page: string;
  factura: Factura;
  titulo: string = 'Factura';
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      this.page = params.get('page');
      this.facturaService.getFactura(Number(id)).subscribe(factura => {
        this.factura = factura;
      });
    });
  }



}
