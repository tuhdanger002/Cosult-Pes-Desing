import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG 18+ Imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabsModule } from 'primeng/tabs';

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
    TextareaModule,
    TagModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    TabsModule
  ],
  templateUrl: './admin-sql.html',
  styleUrls: ['./admin-sql.css']
})
export class AdminSqlComponent implements OnInit {
  circuitos: Circuito[] = [];

  // Listas por estado
  activos: Circuito[] = [];
  inactivos: Circuito[] = [];
  eliminados: Circuito[] = [];
  nuevos: Circuito[] = [];

  displayModal: boolean = false;

  statuses = [
    { label: 'ACTIVO', value: 'ACTIVO' },
    { label: 'INACTIVO', value: 'INACTIVO' },
    { label: 'ELIMINADO', value: 'ELIMINADO' }
  ];

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
        this.categorizarCircuitos(data);
      },
      error: (err) => console.error('Error al obtener circuitos:', err)
    });
  }

  categorizarCircuitos(data: Circuito[]): void {
    this.activos = data.filter(c => c.estado?.toUpperCase() === 'ACTIVO');
    this.inactivos = data.filter(c => c.estado?.toUpperCase() === 'INACTIVO');
    this.eliminados = data.filter(c => c.estado?.toUpperCase() === 'ELIMINADO');
    this.nuevos = data.filter(c => c.estado?.toUpperCase() === 'NUEVO');
  }

  clear(table: Table) {
    table.clear();
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