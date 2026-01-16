import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

// Servicios y Modelos
import { ReporteService } from '../../services/reporte.service';
import { ReportePesDetalle } from '../../models/reporte.model';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [
    CommonModule, FormsModule, SelectModule, DatePickerModule, 
    InputTextModule, ButtonModule, TableModule, TabsModule
  ],
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.css']
})
export class FiltrosComponent implements OnInit {

  // Opciones de filtros
  sectores = [{ label: 'Sector 1', value: 'S1' }, { label: 'Sector 2', value: 'S2' }];
  gerencias = [{ label: 'Gerencia 1', value: 'G1' }, { label: 'Gerencia 2', value: 'G2' }];

  filtros: any = {
    numPes: '',
    usuario: '',
    desde: null,
    hasta: null,
    sector: null,
    gerencia: null
  };

  // Listas para las 3 ventanas
  aprobados: ReportePesDetalle[] = [];
  cancelados: ReportePesDetalle[] = [];
  pendientes: ReportePesDetalle[] = [];

  constructor(
    private reporteService: ReporteService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.establecerRangoFechas();
  }

  establecerRangoFechas() {
    const hoy = new Date();
    const futuro = new Date();
    futuro.setDate(hoy.getDate() + 15);
    this.filtros.desde = hoy;
    this.filtros.hasta = futuro;
  }

  buscar() {
    const params = {
      numPes: this.filtros.numPes.trim() !== '' ? this.filtros.numPes : null,
      usuario: this.filtros.usuario.trim() !== '' ? this.filtros.usuario : null,
      sector: this.filtros.sector?.value || null,
      gerencia: this.filtros.gerencia?.value || null,
      fechaInicio: this.formatearFechaParaSql(this.filtros.desde),
      fechaFin: this.formatearFechaParaSql(this.filtros.hasta)
    };

    // 1. Consulta Aprobados y Cancelados (Usa IsDelete)
    this.reporteService.consultar(params).subscribe({
      next: (data: ReportePesDetalle[]) => {
        this.cancelados = data.filter(item => item.IsDelete == 1);
        this.aprobados = data.filter(item => item.IsDelete != 1);
        this.cd.detectChanges();
      }
    });

    // 2. Consulta Pendientes (API buscar2 - No usa IsDelete)
    this.reporteService.consultarPendientes(params).subscribe({
      next: (data: ReportePesDetalle[]) => {
        this.pendientes = data; 
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error en buscar2:', err)
    });
  }

  private formatearFechaParaSql(fecha: Date | null): string | null {
    if (!fecha) return null;
    const d = new Date(fecha);
    const offset = d.getTimezoneOffset() * 60000;
    const ajustada = new Date(d.getTime() - offset);
    return ajustada.toISOString().split('T')[0];
  }
}