import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticulosService } from '../compartidos/articulosService';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Info } from '../info/info';
import Item from '../clases/item';
import { Editar } from "../editar/editar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stock',
  imports: [FormsModule, CurrencyPipe, Info, Editar, NgClass, RouterLink],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
  standalone: true,
})
export class Stock implements OnInit {

  articulos: Item[] = [];
  filtro: Item[] = [];
  mensaje: String | undefined;
  editar: Item | undefined;
  terminoBusqueda: string = "";
  codigoBusqueda: string = "";
  marcaBusqueda: string = "";

  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
  }
  async ngOnInit(): Promise<void> {
    this.arts.articulos$.subscribe(
      res => {
        this.articulos = res.sort((n1, n2) => {
          if (n1.nombre > n2.nombre) {
            return 1;
          }

          if (n1.nombre < n2.nombre) {
            return -1;
          }

          return 0;
        });
        this.filtro = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
    this.arts.refrescarStock();
  }

  filtrarPorCodigo() {
    const t = this.codigoBusqueda;

    this.filtro = this.articulos.filter(p =>
      p.codigo.startsWith(t)
    );
  }
  
  filtrar() {
    const t = this.terminoBusqueda.toLowerCase();
    
    this.filtro = this.articulos.filter(p =>
      p.nombre.toLowerCase().startsWith(t)
    );
  }

  filtrarPorMarca() {
    const t = this.marcaBusqueda.toLowerCase();
    
    this.filtro = this.articulos.filter(p =>
      p.marca.toLowerCase().startsWith(t)
    );
  }

  crearMensaje(message: any) {
    this.editar = undefined;
    this.mensaje = message;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
  cerrarVentana() {
    this.crearMensaje(undefined);
    this.arts.refrescarStock();
    this.cdr.markForCheck();
    this.cdr.detectChanges();

  }
  ver_articulo(a: Item) {
    this.editar = a;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  cerrarPopup() {
    this.editar = undefined;
  }
}
