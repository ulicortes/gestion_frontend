import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticulosService } from '../compartidos/articulosService';
import Articulo from '../clases/item';
import Compra from '../clases/compra';
import { CurrencyPipe } from '@angular/common';
import { Periodo } from '../clases/periodo';
import { FormsModule } from "@angular/forms";
import Detalle from '../clases/detalle';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reportes',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  ventas: Compra[] = []
  articulos: Articulo[];
  periodo: Periodo = new Periodo(0, 0, 0);
  desde: String = new Date().toISOString().split('T')[0];
  hasta: String = new Date().toISOString().split('T')[0];
  top5: Detalle[] = [];
  top5_menos: Detalle[] = [];
  dias: { [key: string]: number } = {};
  total: number = 0;

  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
    this.articulos = [];
    for (let i = 1; i <= 31; i++) {
      const key = i.toString().padStart(2, '0');
      this.dias[key] = 0;
    }
  }
  ngOnInit(): void {

  }

  buscar() {
    if (this.desde > this.hasta) return;
    this.arts.getResumen(`${this.desde} 00:00:00`, `${this.hasta} 23:59:59`).subscribe(
      res => {
        console.log(res)
        this.periodo = new Periodo(res.ingreso, res.ganancia, res.operaciones);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    )
  }

  traerTop5() {
    this.arts.getTop5MasVendidos().subscribe(
      res => {
        this.top5 = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    )
  }

  traerTop5Menos() {
    this.arts.getTop5MenosVendidos().subscribe(
      res => {
        this.top5_menos = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    )
  }

  traerVolumenVtas() {
    this.arts.getCuentaVtasPorDia().subscribe(
      res => {
        res.map(d => {
          this.dias[d.dia] = d.total;
          if (d.total > this.total) this.total = d.total;
        });
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  // ventasMensuales: { dia: string; total: number }[] = Array.from({ length: 31 }, (_, i) => {
  //   const diaNumero = i + 1;
  //   // Convertimos a string de 2 dígitos (ej: "01", "02")
  //   const diaString = diaNumero.toString().padStart(2, '0');
  //   let nro = Math.floor(Math.random() * 101);
  //   if (nro > this.total) this.total = nro;
  //   return {
  //     dia: diaString,
  //     total: nro // Aleatorio entre 0 y 100
  //   };
  // });

  get diasList() {
    // return this.ventasMensuales;
    return Object.entries(this.dias)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([dia, total]) => ({
        dia,
        total
      }));
  }
}
