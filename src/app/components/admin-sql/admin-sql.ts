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
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    TabsModule,
    RippleModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
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
  esModoInsert: boolean = false;

  displayModal: boolean = false;

  statuses = [
    { label: 'ACTIVO', value: 'ACTIVO' },
    { label: 'INACTIVO', value: 'INACTIVO' },
    { label: 'ELIMINADO', value: 'ELIMINADO' }
  ];

  circuitoSeleccionado: Circuito = {
    smt: '',
    nombre: '',
    cliente: 0,
    estado: '',
    acuerdos_Pes: ''
  };

  constructor(
    private _circuitoService: CircuitoService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerCircuitos();
  }

  obtenerCircuitos(): void {
    // Carga general de circuitos
    this._circuitoService.getCircuitos().subscribe({
      next: (data) => {
        this.circuitos = data;
        this.categorizarCircuitos(data);
      },
      error: (err) => console.error('Error al obtener circuitos:', err)
    });

    // Carga específica de circuitos nuevos
    this._circuitoService.getCircuitosNuevos().subscribe({
      next: (data) => {
        this.nuevos = data;
      },
      error: (err) => console.error('Error al obtener circuitos nuevos:', err)
    });
  }

  categorizarCircuitos(data: Circuito[]): void {
    this.activos = data.filter(c => c.estado?.toUpperCase() === 'ACTIVO');
    this.inactivos = data.filter(c => c.estado?.toUpperCase() === 'INACTIVO');
    this.eliminados = data.filter(c => c.estado?.toUpperCase() === 'ELIMINADO');
    // Ya no filtramos 'NUEVO' de aquí, se carga por separado en obtenerCircuitos()
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

  abrirNuevo(): void {
    this.circuitoSeleccionado = {
      smt: '',
      nombre: '',
      cliente: 0,
      estado: 'ACTIVO',
      acuerdos_Pes: ''
    };
    this.esModoInsert = true;
    this.displayModal = true;
  }

  abrirEditar(circuito: Circuito, esNuevo: boolean = false): void {
    this.circuitoSeleccionado = { ...circuito };
    this.esModoInsert = esNuevo;
    this.displayModal = true;
  }

  actualizarCircuito(): void {
    if (this.esModoInsert) {
      this._circuitoService.insertCircuitoNuevo(this.circuitoSeleccionado).subscribe({
        next: () => {
          this.obtenerCircuitos();
          this.displayModal = false;
          this._messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'El circuito fue insertado correctamente',
            life: 3000
          });
        },
        error: (err) => console.error('Error al insertar:', err)
      });
    } else if (this.circuitoSeleccionado.id) {
      this._circuitoService.updateCircuito(this.circuitoSeleccionado.id, this.circuitoSeleccionado)
        .subscribe({
          next: () => {
            this.obtenerCircuitos();
            this.displayModal = false;
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Los datos fueron actualizados',
              life: 3000
            });
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
    }
  }
}