import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Compra from '../clases/compra';
import { ArticulosService } from '../compartidos/articulosService';
import { CurrencyPipe } from '@angular/common';
import Detalle from '../clases/detalle';


@Component({
  selector: 'app-historial',
  imports: [CurrencyPipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  compras: Compra[] = [];
  detalles: Detalle[] = [];
  nro: number = 0;
  abierto: boolean = false;
  total: number = 0;
  fecha: string = '';
  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.arts.getVentas().subscribe(
      res => {
        this.compras = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  verDetalle(id: number, total: number, fecha: string) {
    this.toggleVentana()
    this.arts.getDetalle(id).subscribe(
      res => {
        this.detalles = res;
        this.total = total;
        this.fecha = fecha;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  toggleVentana() {
    this.abierto = !this.abierto;
  }

}
