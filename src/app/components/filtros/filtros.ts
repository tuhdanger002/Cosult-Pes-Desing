import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// PrimeNG Modules
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
    CommonModule, 
    FormsModule, 
    SelectModule, 
    DatePickerModule, 
    InputTextModule, 
    ButtonModule, 
    TableModule, 
    TabsModule
  ],
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.css'],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class FiltrosComponent implements OnInit {

  // Control de la pestaña activa (0: Aprobados, 1: Cancelados, 2: Pendientes)
  activeTab: string = '0';

  // Opciones de filtros
  sectores = [
    { label: 'Santiago', value: 'Santiago' }, 
    { label: 'La Vega', value: 'La Vega' }, 
    { label: 'Puerto Plata', value: 'Puerto Plata' }, 
    { label: 'San Francisco', value: 'San Francisco' }, 
    { label: 'Valverde Mao', value: 'Valverde Mao' }
  ];
  
  gerencias = [
    { label: 'Gerencia 1', value: 'G1' }, 
    { label: 'Gerencia 2', value: 'G2' }
  ];

  filtros: any = {
    numPes: '',
    usuario: '',
    desde: null,
    hasta: null,
    sector: null,
    gerencia: null
  };

  // Listas de datos
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
    // 1. Limpieza inmediata para evitar datos residuales y asegurar respuesta al primer clic
    this.aprobados = [];
    this.cancelados = [];
    this.pendientes = [];
    
    // Forzamos actualización visual de que las tablas se vaciaron (feedback de carga)
    this.cd.detectChanges();

    // Preparación de parámetros
    const params = {
      numPes: this.filtros.numPes?.trim() !== '' ? this.filtros.numPes.trim() : null,
      usuario: this.filtros.usuario?.trim() !== '' ? this.filtros.usuario.trim() : null,
      sector: this.filtros.sector?.value || null,
      gerencia: this.filtros.gerencia?.value || null,
      fechaInicio: this.formatearFechaParaSql(this.filtros.desde),
      fechaFin: this.formatearFechaParaSql(this.filtros.hasta)
    };

    const pesBuscado = this.filtros.numPes?.trim();

    // 2. Consulta Aprobados y Cancelados (Usa IsDelete)
    this.reporteService.consultar(params).subscribe({
      next: (data: ReportePesDetalle[]) => {
        this.cancelados = data.filter(item => item.IsDelete == 1);
        this.aprobados = data.filter(item => item.IsDelete != 1);

        // Lógica de enfoque automático
        if (pesBuscado) {
          if (this.aprobados.some(item => item.NUM_PES == pesBuscado)) {
            this.activeTab = '0';
          } else if (this.cancelados.some(item => item.NUM_PES == pesBuscado)) {
            this.activeTab = '1';
          }
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error en Consulta 1:', err);
        this.cd.detectChanges();
      }
    });

    // 3. Consulta Pendientes (API buscar2)
    this.reporteService.consultarPendientes(params).subscribe({
      next: (data: ReportePesDetalle[]) => {
        this.pendientes = data; 

        // Si no se encontró en las anteriores, buscamos en pendientes
        if (pesBuscado && this.pendientes.some(item => item.NUM_PES == pesBuscado)) {
          this.activeTab = '2';
        }
        
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error en Consulta Pendientes:', err);
        this.cd.detectChanges();
      }
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