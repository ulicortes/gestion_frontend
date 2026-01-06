import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-articulo',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './articulo.html',
  styleUrl: './articulo.css',
})
export class Articulo {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: Number,
      nombre: '',
      marca: '',
      cantidad: Number,
      compra: Number,
      venta: Number,
      proveedor: ''
    })
  }

  enviar() {
    alert(this.form.get('id')?.value)
  }
}
