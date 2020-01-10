import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.css']
})
export class FooterComponent implements OnInit {

  public autor: any = {
    nombre1: 'Jesus',
    apellido1: 'Melendez',
    nombre2: 'Ariel',
    apellido2: 'Saidel'
  };
  constructor() { }

  ngOnInit() {
  }

}
