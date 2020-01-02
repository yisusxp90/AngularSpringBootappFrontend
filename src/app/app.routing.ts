import { Routes, RouterModule } from '@angular/router';
import {ClientesComponent} from './components/clientes/clientes.component';
import {FormComponent} from './components/clientes/form.component';
import {DetalleComponent} from './components/clientes/detalle/detalle.component';
import {LoginComponent} from './components/usuarios/login.component';
import {AuthGuard} from './components/guards/auth.guard';
import {RoleGuard} from './components/guards/role.guard';
import {DetalleFacturaComponent} from "./components/facturas/detalle-factura.component";
import {FacturasComponent} from './components/facturas/facturas.component';

const appRoutes: Routes = [
    // {path: 'clientes/ver/:id/:page', component: DetalleComponent},
    {path: 'clientes/crear/:page', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
    {path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard]},
    {path: 'clientes/page/:page', component: ClientesComponent, canActivate: [AuthGuard]},
    {path: 'clientes/:page/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
    {path: 'facturas/:id', component: DetalleFacturaComponent},
    {path: 'facturas/form/:page/:clienteId', component: FacturasComponent}
  ];

export const routing = RouterModule.forRoot(appRoutes);
