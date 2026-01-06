import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Articulo from '../clases/articulo';
import ElemSalida from '../clases/elemSalida';
import { FormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {

  articulos: Articulo[];
  salida: ElemSalida[];
  total: number;
  id: number = 0;
  cantidad: number = 0;
  seleccion: Articulo | undefined;

  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
    this.articulos = [];
    this.salida = [];
    this.total = 0;
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

  agregar(ar: Articulo) {
    if (this.salida.find((e) => e.getId() == ar.id) == undefined) {
      this.salida.push(new ElemSalida(ar.id, ar.nombre, this.cantidad, ar.cantidad, ar.venta));
      this.total = 0;
      this.salida.forEach(it => {
        this.total += parseFloat((it.getCantidad() * it.getVenta()).toFixed(2));
      });
      this.cantidad = 0;
      this.id = 0;
      this.seleccion = undefined;
    }
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

  cambiarId(id: number) {
    this.id = id
  }

  buscarArticulo() {
    this.seleccion = this.articulos.filter(a => a.id == this.id)[0];
  }
}
