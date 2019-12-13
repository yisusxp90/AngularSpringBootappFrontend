import { Routes, RouterModule } from '@angular/router';
import {ClientesComponent} from './components/clientes/clientes.component';
import {FormComponent} from './components/clientes/form.component';
import {DetalleComponent} from './components/clientes/detalle/detalle.component';
import {LoginComponent} from './components/usuarios/login.component';

const appRoutes: Routes = [
    // {path: 'clientes/ver/:id/:page', component: DetalleComponent},
    {path: 'clientes/crear/:page', component: FormComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: 'clientes/page/:page', component: ClientesComponent},
    {path: 'clientes/:page/:id', component: FormComponent}
  ];

export const routing = RouterModule.forRoot(appRoutes);
