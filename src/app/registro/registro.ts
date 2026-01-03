import { Component, OnInit } from '@angular/core';
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
  constructor(private arts: ArticulosService) {
    this.articulos = [];
    this.salida = [];
    this.total = 0;
  }
  ngOnInit(): void {
    this.articulos = this.arts.getArticulos();
  }
  agregar(ar: Articulo) {
    if (this.salida.find((e) => e.getId() == ar.getId()) == undefined) {
      this.salida.push(new ElemSalida(ar.getId(), ar.getNombre(), 1, ar.getCantidad(), ar.getVenta()));
      this.total = 0;
      this.salida.forEach(it => {
        this.total += parseFloat((it.getCantidad() * it.getVenta()).toFixed(2));
      });
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
  newValue(e: number, item: ElemSalida) {
    item.setCantidad(e);
    this.total = 0;
    this.salida.forEach(it => {
      this.total += parseFloat((it.getCantidad() * it.getVenta()).toFixed(2));
    });
  }
}
