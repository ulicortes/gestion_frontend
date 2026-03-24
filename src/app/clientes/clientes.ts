import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticulosService } from '../compartidos/articulosService';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import Compra from '../clases/compra';
import Detalle from '../clases/detalle';
import ArticuloSalida from '../clases/articuloSalida';

@Component({
  selector: 'app-clientes',
  imports: [RouterLink, CurrencyPipe, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: any[] = [];
  filtro: any[] = [];
  comprasDeCliente: any[] = [];
  cliente: String = "";
  nombreBusqueda: string = "";
  detalles: Detalle[] = [];
  total: number = 0;
  id_compra: number = 0;
  fecha: string = '';
  abierto: boolean = false;
  mensaje: string = '';
  mdp: FormGroup;
  saldo_acumulado: number = 0;
  private datePipe = new DatePipe('en-US');

  constructor(private arts: ArticulosService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.mdp = this.fb.group({
      mdp: ''
    })
  }
  ngOnInit(): void {
    this.arts.getClientes().subscribe({
      next: res => {
        this.clientes = res;
        this.filtro = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: e => console.log(e)
    }
    );

  }
  abrirCuenta(id: number, nombre: string, apellido: string) {
    this.arts.getAllVentasDeUnCliente(id).subscribe({
      next: res => {
        this.mensaje = '';
        this.calculoSaldo(res);
        this.cliente = `${nombre} ${apellido}`;
        this.cdr.detectChanges();
      },
      error: e => console.log(e)
    }
    );
  }

  verDetalle(id: number, total: number, fecha: string) {
    this.toggleVentana()
    this.arts.getDetalle(id).subscribe(
      res => {
        this.detalles = res;
        console.log(this.detalles);
        this.total = total;
        this.fecha = fecha;
        this.id_compra = id;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  confirmarPago() {
    let medio = this.mdp.get('mdp')?.value;
    if (medio == '') {
      return;
    }
    let arts_venta: ArticuloSalida[] = [];
        this.detalles.forEach(s => {
          arts_venta.push(new ArticuloSalida(s.id_art, s.cantidad, s.total));
        });
    this.arts.confirmPago(this.id_compra, Number(medio), this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")!, this.total, arts_venta).subscribe(
      res => {
        this.mensaje = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    );
  }

  toggleVentana() {
    this.abierto = !this.abierto;
    this.cdr.detectChanges();
  }

  filtrarPorNombre() {
    const t = this.nombreBusqueda.toLowerCase();

    this.filtro = this.clientes.filter(p =>
      p.nombre.toLowerCase().startsWith(t) ||
      p.apellido.toLowerCase().startsWith(t)
    );
    this.cdr.detectChanges();
  }

  medio(mdp: number) {
    switch (mdp) {
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

  calculoSaldo(datos: any[]) {
    let acumulado = 0;
    this.comprasDeCliente = datos.map(d => {
      if (d.pagado == 0) {
        acumulado += d.total;
      }
      if (d.pagado == 1 && acumulado - d.total > 0) {
        acumulado -= d.total;
      }

      return {
        ...d,
        saldo: acumulado
      };
    });
    this.saldo_acumulado = acumulado;
  }
}

