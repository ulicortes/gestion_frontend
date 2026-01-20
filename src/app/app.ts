import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gestion_frontend');

  constructor(private router: Router){}

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key === 'F6') {
      this.router.navigate(['/'])
    }
    if (event.key === 'F7') {
      this.router.navigate(['/registro'])
    }
    if (event.key === 'F8') {
      this.router.navigate(['/historial'])
    }
    if (event.key === 'F9') {
      this.router.navigate(['/articulo'])
    }
  }
}
