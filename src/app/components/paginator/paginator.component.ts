import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input()
  paginador: any;
  paginas: number[];
  constructor() { }

  ngOnInit() {
    this.paginas = new Array(this.paginador.totalPages).fill(0)
      .map((valor, indice) => {
        return indice + 1;
      });
  }
  ngOnChanges() {
    this.ngOnInit();
  }

}
