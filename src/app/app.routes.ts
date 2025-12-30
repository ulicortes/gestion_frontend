import { Routes } from '@angular/router';
import { Stock } from './stock/stock';
import { Articulo } from './articulo/articulo';
import { Registro } from './registro/registro';
import { Historial } from './historial/historial';

export const routes: Routes = [
    {path: '', component: Stock},
    {path: 'articulo', component: Articulo},
    {path: 'registro', component: Registro},
    {path: 'historial', component: Historial}
];
