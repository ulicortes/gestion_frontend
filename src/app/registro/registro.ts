import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Articulo from '../clases/item';
import ElemSalida from '../clases/elemSalida';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';
import ArticuloSalida from '../clases/articuloSalida';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {

  articulos: Articulo[];
  filtro: Articulo[];
  salida: ElemSalida[];
  clientes: any[] = []
  total: number;
  ar: string = '';
  cod: string = '';
  cantidad: number = 1;
  seleccion: Articulo | undefined;
  info: String;
  abierto: boolean = false;
  cliente: FormGroup;
  mdp: FormGroup;
  private datePipe = new DatePipe('en-US');

  constructor(private arts: ArticulosService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.articulos = [];
    this.filtro = [];
    this.salida = [];
    this.total = 0;
    this.info = '';
    this.cliente = this.fb.group({
      id: ''
    });
    this.mdp = this.fb.group({
      mdp: ''
    })
  }

  ngOnInit(): void {
    this.arts.articulos$.subscribe(
      res => {
        this.articulos = res.filter(a => a.cantidad > 0);
        this.filtro = this.articulos;
        this.info = '';
      }
    );
    this.arts.refrescarStock();
    this.arts.getClientes().subscribe({
      next: res => {
        this.clientes = res
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: e => console.log(e)
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
        this.total += (it.getCantidad() * it.getVenta());
      });
      this.cantidad = 1;
      this.cod = '';
      this.seleccion = undefined;
      this.filtro = this.articulos;
    }
  }

  realizarCompra() {
    let medio = this.mdp.get('mdp')?.value;
    let id_cliente = this.cliente.get('id')?.value;

    if (this.total == 0) {
      this.crearMensaje("No hay productos en el carrito.");
      return;
    }
    if (medio == '') {
      this.crearMensaje("Seleccionar medio de pago");
      return;
    }
    if (id_cliente == '') {
      this.crearMensaje("Seleccionar un cliente");
      return;
    }

    let arts_venta: ArticuloSalida[] = [];
    this.salida.forEach(s => {
      arts_venta.push(new ArticuloSalida(s.getId(), s.getCantidad(), s.getVenta()));
    });
    let pagado = (medio == 0 ? 0 : 1);
    if (pagado == 0) {
      this.arts.newExitCuenta(this.total, this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")!, arts_venta, Number(id_cliente), pagado, Number(medio))
        .subscribe({
          next: res => {
            console.log(res);
            this.crearMensaje(res);
            this.total = 0;
            this.salida = [];
          },
          error: e => this.crearMensaje(e)
        });
    } else {
      this.arts.newExit(this.total, this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")!, arts_venta, Number(id_cliente), pagado, Number(medio))
        .subscribe({
          next: res => {
            console.log(res);
            this.crearMensaje(res);
            this.total = 0;
            this.salida = [];
          },
          error: e => this.crearMensaje(e)
        });
    }

  }

  crearMensaje(msg: string) {
    this.info = msg;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.arts.refrescarStock();
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
    if (c == null) { this.filtro = this.articulos; }
    else { this.filtro = this.articulos.filter(a => a.codigo.startsWith(c)); }
  }

  buscarArticulo() {
    this.seleccion = this.articulos.filter(a => a.codigo == this.cod)[0];
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      this.toggleFiltro()
    }
    if (event.key === 'Escape') {
      this.abierto = false;
    }
  }
}
