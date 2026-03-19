import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';
import Item from '../clases/item';
import { DatePipe } from '@angular/common';
import { Cliente } from '../clases/cliente';
import { RouterLink } from '@angular/router';

enum mensaje {
  FIELDS = "Faltan campos por completar.",
  TYPES = "Los campos 'Codigo', 'Cantidad', 'Compra' y 'Venta' tienen que ser numeros.",
  SERVER = "Hubo un error en el servidor: "
}

@Component({
  selector: 'app-articulo',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './articulo.html',
  styleUrl: './articulo.css',
})

export class Articulo {
  form: FormGroup;
  cliente: FormGroup;
  info: String;
  private datePipe = new DatePipe('en-US');

  constructor(private arts: ArticulosService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.info = '';
    this.form = this.fb.group({
      id: '',
      codigo: '',
      nombre: '',
      marca: '',
      cantidad: '',
      compra: '',
      venta: '',
      proveedor: ''
    })
    this.cliente = this.fb.group({
      nombre: '',
      apellido: '',
      contacto: ''
    })
  }

  enviar() {
    let { codigo, nombre, marca, cantidad, compra, venta, proveedor } = this.form.value;

    if (!this.formCompleto(codigo, nombre, marca, cantidad, compra, venta, proveedor)) {
      this.crearMensaje(mensaje.FIELDS);
      return;
    }
    if (!this.tiposCorrectos(cantidad, compra, venta)) {
      this.crearMensaje(mensaje.TYPES);
      return;
    }

    let nuevo = new Item(0, codigo, nombre, marca, cantidad, compra * 100,
      venta * 100, proveedor, this.datePipe.transform(new Date(), "yyyy-MM-dd")!);
    this.arts.newArticulo(nuevo).subscribe({
      next: res => {
        this.crearMensaje(res);
        this.form = this.fb.group({
          id: '',
          codigo: '',
          nombre: '',
          marca: '',
          cantidad: '',
          compra: '',
          venta: '',
          proveedor: ''
        })
      },
      error: e => this.crearMensaje(mensaje.SERVER + e)
    });

  }

  formCompleto(codigo: any, nombre: any, marca: any, cantidad: any, compra: any, venta: any, proveedor: any): boolean {
    return codigo != '' && nombre != '' && marca != '' &&
      cantidad != '' && compra != '' && venta != '' && proveedor != '';
  }

  tiposCorrectos(cantidad: any, compra: any, venta: any): boolean {
    return typeof (cantidad) === 'number' &&
      typeof (compra) === 'number' && typeof (venta) === 'number';
  }

  nuevoCliente() {
    let { nombre, apellido, contacto } = this.cliente.value;
    let nuevo = new Cliente(0, nombre, apellido, contacto);
    this.arts.newCliente(nuevo).subscribe({
      next: res => {
        this.crearMensaje(res);
        this.cliente = this.fb.group({
          nombre: '',
          apellido: '',
          contacto: ''
        })
      },
      error: e => this.crearMensaje(mensaje.SERVER + e)
    });
  }

  crearMensaje(msg: string) {
    this.info = msg;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
