import { Component, OnInit } from '@angular/core';
import Articulo from '../clases/articulo';
import ElemSalida from '../clases/elemSalida';
import { FormsModule } from '@angular/forms';

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
  constructor() {
    this.articulos = [];
    this.salida = [];
    this.total = 0;
  }
  ngOnInit(): void {
    this.articulos = [
      new Articulo(1, "Interruptor Termomagnético 2x20A", "Schneider", 50, 4.50, 7.20, "ElectricData S.A.", "2023-10-15"),
      new Articulo(2, "Cable THHN AWG #12 (Rollo 100m)", "Indeco", 20, 45.00, 62.50, "Cables del Sur", "2023-11-02"),
      new Articulo(3, "Tomacorriente Doble con Tierra", "Leviton", 100, 2.10, 3.80, "Suministros Alpha", "2023-11-10"),
      new Articulo(4, "Cinta Aislante (Negro)", "3M", 200, 0.80, 1.50, "Ferreteria Central", "2023-09-20"),
      new Articulo(5, "Panel LED Circular 18W", "Philips", 40, 6.00, 11.50, "Ilumina S.A.C.", "2023-11-25"),
      new Articulo(6, "Caja Rectangular Galvanizada", "Dexson", 300, 0.45, 0.90, "MetalMec", "2023-10-05"),
      new Articulo(7, "Diferencial Residual 2x40A", "ABB", 15, 18.00, 28.00, "ElectricData S.A.", "2023-11-12"),
      new Articulo(8, "Tubo Conduit PVC 3/4 (Tramo 3m)", "Pavco", 80, 1.20, 2.50, "Tubos & Perfiles", "2023-11-18"),
      new Articulo(9, "Multímetro Digital", "Fluke", 5, 120.00, 185.00, "Herramientas Pro", "2023-08-30"),
      new Articulo(10, "Lámpara de Emergencia LED", "Opalux", 25, 12.50, 22.00, "Suministros Alpha", "2023-12-01"),
      new Articulo(11, "Pulsador Timbre Redondo", "BTicino", 60, 1.80, 3.20, "Cables del Sur", "2023-11-05"),
      new Articulo(12, "Sensor de Movimiento 360°", "Sylvania", 12, 8.90, 15.50, "Ilumina S.A.C.", "2023-11-20"),
      new Articulo(13, "Canaleta con Adhesivo 20x10mm", "Legrand", 150, 1.10, 2.30, "Ferreteria Central", "2023-10-28"),
      new Articulo(14, "Bornera de Conexión 10mm", "Phoenix Contact", 500, 0.15, 0.40, "ElectricData S.A.", "2023-11-01"),
      new Articulo(15, "Foco LED E27 9W (Luz Fría)", "Sylvania", 120, 0.95, 1.80, "Ilumina S.A.C.", "2023-12-05")
    ];
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
