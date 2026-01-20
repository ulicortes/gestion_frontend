import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticulosService } from '../compartidos/articulosService';
import { CurrencyPipe } from '@angular/common';
import Articulo from '../clases/item';
import { Info } from '../info/info';
import { invoke } from '@tauri-apps/api/core';
import Item from '../clases/item';
import { Editar } from "../editar/editar";

@Component({
  selector: 'app-stock',
  imports: [CurrencyPipe, Info, Editar],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
  standalone: true,
})
export class Stock implements OnInit {

  articulos: Articulo[] = [];
  mensaje: String | undefined;
  editar: Item | undefined;

  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.arts.getArticulos().subscribe(
      res => {
        this.articulos = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
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
    this.arts.getArticulos().subscribe(
      res => {
        this.articulos = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
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
