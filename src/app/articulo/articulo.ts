import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticulosService } from '../compartidos/articulosService';
import Item from '../clases/item';

@Component({
  selector: 'app-articulo',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './articulo.html',
  styleUrl: './articulo.css',
})
export class Articulo {
  form: FormGroup;
  info: String;
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
  }

  enviar() {
    if (this.formCompleto()) {
      let nuevo = new Item(0, this.form.get('codigo')?.value, this.form.get('nombre')?.value,
        this.form.get('marca')?.value, this.form.get('cantidad')?.value, this.form.get('compra')?.value,
        this.form.get('venta')?.value, this.form.get('proveedor')?.value, new Date().toLocaleDateString())
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
        error: e => this.crearMensaje(e)
      });
    } else {
      this.crearMensaje("Faltan campos por completar");
    }
  }
  formCompleto(): boolean {
    return this.form.get('codigo')?.value != '' && this.form.get('nombre')?.value != '' &&
      this.form.get('marca')?.value != '' && this.form.get('cantidad')?.value != '' &&
      this.form.get('compra')?.value != '' && this.form.get('venta')?.value != '' &&
      this.form.get('proveedor')?.value != '';
  }
  crearMensaje(msg: string) {
    this.info = msg;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
