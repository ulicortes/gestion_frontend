import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticulosService } from '../compartidos/articulosService';
import { FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clientes',
  imports: [RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: any[] = []

  constructor(private arts: ArticulosService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
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

}
