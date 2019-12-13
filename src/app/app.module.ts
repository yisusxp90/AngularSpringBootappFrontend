import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import {ClienteService} from './services/cliente.service';
import {routing} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
import { FormComponent } from './components/clientes/form.component';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { DetalleComponent } from './components/clientes/detalle/detalle.component';
import { LoginComponent } from './components/usuarios/login.component';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
