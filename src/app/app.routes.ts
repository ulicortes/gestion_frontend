import { Routes } from '@angular/router';
import { Stock } from './stock/stock';
import { Articulo } from './articulo/articulo';
import { Registro } from './registro/registro';
import { Historial } from './historial/historial';
import { Reportes } from './reportes/reportes';
import { Clientes } from './clientes/clientes';
import { Inicio } from './inicio/inicio';

export const routes: Routes = [
    {path: '', component: Inicio, children:[
        {path: 'stock', component: Stock},
        {path: 'articulo', component: Articulo},
        {path: 'registro', component: Registro},
        {path: 'historial', component: Historial},
        {path: 'reportes', component: Reportes},
        {path: 'clientes', component: Clientes}
    ]},

];
