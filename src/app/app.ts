import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. Importa esto

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 2. Cambia FiltrosComponent por RouterOutlet
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cosult-Pes-Desing');
  }