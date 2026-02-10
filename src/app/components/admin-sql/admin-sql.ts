import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG 18+ Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';

import { Circuito } from '../../models/circuito.model';
import { CircuitoService } from '../../services/circuito.service';

@Component({
  selector: 'app-admin-sql',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule, // <--- CORRECCIÓN AQUÍ
    TagModule
  ],
  templateUrl: './admin-sql.html',
  styleUrls: ['./admin-sql.css']
})
export class AdminSqlComponent implements OnInit {
  circuitos: Circuito[] = [];
  displayModal: boolean = false;

  circuitoSeleccionado: Circuito = {
    smt: '',
    nombre: '',
    estado: '',
    acuerdos_Pes: ''
  };

  constructor(private _circuitoService: CircuitoService) { }

  ngOnInit(): void {
    this.obtenerCircuitos();
  }

  obtenerCircuitos(): void {
    this._circuitoService.getCircuitos().subscribe({
      next: (data) => {
        this.circuitos = data;
      },
      error: (err) => console.error('Error al obtener circuitos:', err)
    });
  }

  // Resuelve el error de "severity" (PrimeNG 18 usa 'warn' en vez de 'warning')
  getSeverity(estado: string | undefined): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (estado?.toUpperCase()) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'warn';
      case 'ELIMINADO': return 'danger';
      case 'PENDIENTE': return 'info';
      default: return 'secondary';
    }
  }

  abrirEditar(circuito: Circuito): void {
    this.circuitoSeleccionado = { ...circuito };
    this.displayModal = true;
  }

  actualizarCircuito(): void {
    if (this.circuitoSeleccionado.id) {
      this._circuitoService.updateCircuito(this.circuitoSeleccionado.id, this.circuitoSeleccionado)
        .subscribe({
          next: () => {
            this.obtenerCircuitos();
            this.displayModal = false;
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
    }
  }
}