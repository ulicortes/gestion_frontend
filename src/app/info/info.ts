import { Component, EventEmitter, Input, Output } from '@angular/core';
import Item from '../clases/item';

@Component({
  selector: 'app-info',
  imports: [],
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info {
  @Input() msj: String | undefined;
  @Output() salida = new EventEmitter<any>();

  cerrarVentana() {
    this.salida.emit();
  }
}
