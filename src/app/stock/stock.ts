import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticulosService } from '../compartidos/articulosService';
import { CurrencyPipe} from '@angular/common';
import Articulo from '../clases/articulo';

@Component({
  selector: 'app-stock',
  imports: [CurrencyPipe],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
  standalone: true,
})
export class Stock implements OnInit {
  articulos: Articulo[] = [];
  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) {
    
  }
  ngOnInit(): void {
    this.arts.getArticulos().subscribe(
      res => {
        this.articulos = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        console.log('1. Respuesta del servidor:', res);
        console.log('2. Variable de la clase:', this.articulos);
      }
    );
  }
}
