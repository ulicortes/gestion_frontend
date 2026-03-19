import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';
import Item from '../clases/item';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editar',
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './editar.html',
  styleUrl: './editar.css',
})
export class Editar implements OnInit {
  @Input() articulo: Item | undefined;
  @Output() salida = new EventEmitter<any>();
  @Output() salida_editar = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<any>();
  form: FormGroup;
  mensaje: String | undefined;
  fecha: String | undefined;
  private datePipe = new DatePipe('en-US');

  constructor(private arts: ArticulosService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      id: '',
      codigo: '',
      nombre: '',
      marca: '',
      cantidad: '',
      compra: '',
      venta: '',
      proveedor: '',
    })
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      id: this.articulo?.id,
      codigo: this.articulo?.codigo,
      nombre: this.articulo?.nombre,
      marca: this.articulo?.marca,
      cantidad: this.articulo?.cantidad,
      compra: (this.articulo?.compra || 0) / 100,
      venta: (this.articulo?.venta || 0) / 100,
      proveedor: this.articulo?.proveedor,
    })
    this.fecha = this.articulo?.fecha;
  }

  editar(id: number) {
    let articulo = new Item(id, this.form.get('codigo')?.value, this.form.get('nombre')?.value,
      this.form.get('marca')?.value, this.form.get('cantidad')?.value, (this.form.get('compra')?.value * 100),
      (this.form.get('venta')?.value * 100), this.form.get('proveedor')?.value, this.datePipe.transform(new Date(), "yyyy-MM-dd")!);
    this.arts.editArticulo(articulo).subscribe({
      next: res => {
        this.crearMensaje(res)
        this.salida_editar.emit();
      },
      error: e => this.crearMensaje(e)
    })
  }

  borrarArticulo(id: number) {
    this.arts.deleteArticulo(id).subscribe({
      next: res => {
        this.crearMensaje(res)
        this.salida.emit();
      },
      error: e => this.crearMensaje(e)
    })
  }

  crearMensaje(message: any) {
    this.mensaje = message;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  cerrarVentana() {
    this.cerrar.emit();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key === 'Escape') {
      this.cerrar.emit();
    }
  }
}
