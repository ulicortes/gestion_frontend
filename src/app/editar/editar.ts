import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';
import Item from '../clases/item';

@Component({
  selector: 'app-editar',
  imports: [FormsModule, ReactiveFormsModule],
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
      compra: this.articulo?.compra,
      venta: this.articulo?.venta,
      proveedor: this.articulo?.proveedor,
    })
  }

  editar(id: number) {
    let articulo = new Item(id, this.form.get('codigo')?.value, this.form.get('nombre')?.value,
      this.form.get('marca')?.value, this.form.get('cantidad')?.value, this.form.get('compra')?.value,
      this.form.get('venta')?.value, this.form.get('proveedor')?.value, new Date().toLocaleDateString());
      this.arts.editArticulo(articulo).subscribe({
        next: res => {
          this.crearMensaje(res)
          console.log(res)
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
    // this.crearMensaje(undefined);
    this.cerrar.emit();
    // this.cdr.markForCheck();
    // this.cdr.detectChanges();
  }
}
