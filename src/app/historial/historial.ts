import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import Compra from '../clases/compra';
import { ArticulosService } from '../compartidos/articulosService';
import { CurrencyPipe, DatePipe } from '@angular/common';
import Detalle from '../clases/detalle';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-historial',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  ventas: Compra[] = [];
  historicoVentas: Compra[] = [];
  detalles: Detalle[] = [];
  nro: number = 0;
  abierto: boolean = false;
  total: number = 0;
  fecha: string = '';
  muestraDatos: Compra[] = [];
  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    this.arts.getVentas().subscribe(
      res => {
        this.ventas = res;
        this.muestraDatos = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  cargar() {
    this.arts.getAllVentas().subscribe(
      res => {
        this.historicoVentas = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    )
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

  medio(mdp: number) {
  switch(mdp) {
    case 1: return 'EFECTIVO';
    case 2: return 'TRANFERENCIA';
    case 3: return 'DEBITO';
    case 4: return 'CREDITO';
    case 5: return 'CHEQUE';
    case 6: return 'QR';
    case 7: return 'BILLETERA VIRTUAL';
    default: return 'CUENTA CORRIENTE';
  }
}

@HostListener('document:keyup', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    this.abierto = false;
  }
}

}
