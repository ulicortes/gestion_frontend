import { Component, OnInit } from '@angular/core';
import Articulo from '../clases/articulo';
import { ArticulosService } from '../compartidos/articulosService';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stock',
  imports: [CurrencyPipe],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
  standalone: true,
})
export class Stock implements OnInit {
  articulos: Articulo[];
  constructor(private arts: ArticulosService) {
    this.articulos = arts.getArticulos();
  }
  ngOnInit(): void {
    this.articulos = this.arts.getArticulos();
  }
}
