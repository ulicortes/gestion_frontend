import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Articulo from '../clases/item';
import ElemSalida from '../clases/elemSalida';
import { FormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';
import ArticuloSalida from '../clases/articuloSalida';
import { CurrencyPipe } from '@angular/common';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {

  articulos: Articulo[];
  filtro: Articulo[];
  salida: ElemSalida[];
  total: number;
  ar: string = '';
  cod: string = '';
  cantidad: number = 1;
  seleccion: Articulo | undefined;
  info: String;
  abierto: boolean = false;

  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
    this.articulos = [];
    this.filtro = [];
    this.salida = [];
    this.total = 0;
    this.info = '';
  }

  ngOnInit(): void {
    this.arts.getArticulos().subscribe(
      res => {
        this.articulos = res;
        this.filtro = res;
        this.info = '';
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  toggleFiltro() {
    this.abierto = !this.abierto;
  }

  agregar(ar: Articulo) {
    if (this.salida.find((e) => e.getId() == ar.id) == undefined) {
      this.salida.push(new ElemSalida(ar.id, ar.codigo, ar.nombre, this.cantidad, ar.cantidad, ar.venta));
      this.total = 0;
      this.salida.forEach(it => {
        this.total += parseFloat((it.getCantidad() * it.getVenta()).toFixed(2));
      });
      this.cantidad = 1;
      this.cod = '';
      this.seleccion = undefined;
      this.filtro = this.articulos;
    }
  }

  realizarCompra() {
    if (this.total > 0) {
      let arts_venta: ArticuloSalida[] = [];
      this.salida.forEach(s => {
        arts_venta.push(new ArticuloSalida(s.getId(), s.getCantidad(), s.getVenta()));
      })
      this.arts.newExit(this.total, new Date().toLocaleDateString(), arts_venta).subscribe({
        next: res => {
          this.crearMensaje(res);
          this.total = 0;
          this.salida = [];
        },
        error: e => this.crearMensaje(e)
      });
    } else {
      this.crearMensaje("No hay productos en el carrito.");
    }
  }

  crearMensaje(msg: string) {
    this.info = msg;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  borrar(elemento: ElemSalida) {
    let index = this.salida.indexOf(elemento);
    this.salida.splice(index, 1);
    this.total = 0;
    this.salida.forEach(it => {
      this.total += parseFloat((it.getCantidad() * it.getVenta()).toFixed(2));
    });
  }

  newValue(e: number) {
    this.cantidad = e;
  }

  cambiarArt(n: string) {
    this.filtro = this.articulos.filter(a => a.nombre.toLowerCase().includes(n));
  }

  cambiarCod(c: string) {
    if(c == null) {this.filtro = this.articulos;}
    else {this.filtro = this.articulos.filter(a => a.codigo.startsWith(c));}
  }

  buscarArticulo() {
    this.seleccion = this.articulos.filter(a => a.codigo == this.cod)[0];
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log(event.key)
    if (event.key === 'F5') {
      this.toggleFiltro()
    }
  }
}
