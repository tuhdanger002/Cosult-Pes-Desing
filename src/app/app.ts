import { Component, signal } from '@angular/core';
import { FiltrosComponent } from './components/filtros/filtros';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FiltrosComponent], // Aquí le das permiso de existir
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cosult-Pes-Desing');
}