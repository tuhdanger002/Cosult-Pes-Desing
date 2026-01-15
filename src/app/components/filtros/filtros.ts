import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ReporteService } from '../../services/reporte.service';
import { ReportePesDetalle } from '../../models/reporte.model';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    InputTextModule, 
    ButtonModule, 
    DatePickerModule, 
    SelectModule
  ],
  templateUrl: './filtros.html',
  styleUrl: './filtros.css'
})
export class FiltrosComponent {
  // 1. Definimos las opciones con estructura clara
  sectores = [
    { label: 'Sector 1', value: 'Sector 1' },
    { label: 'Sector 2', value: 'Sector 2' }
  ];
  
  gerencias = [
    { label: 'Gerencia Norte', value: 'Gerencia Norte' },
    { label: 'Gerencia Sur', value: 'Gerencia Sur' }
  ];

  // 2. Inicializamos como objetos vacíos o tipos 'any' para evitar el error rojo
  filtros: any = {
  numPes: '',
  usuario: '',
  desde: null,
  hasta: null,
  sector: null,
  gerencia: null
  };

  resultados: ReportePesDetalle[] = [];

  constructor(private reporteService: ReporteService, private cd: ChangeDetectorRef) {}

 ngOnInit() {
  const hoy = new Date();
  const quinceDias = new Date();
  quinceDias.setDate(hoy.getDate() + 15);

  this.filtros.desde = hoy;
  this.filtros.hasta = quinceDias;
}

buscar() {
  const formatear = (f: any) => f ? new Date(f).toISOString().split('T')[0] : null;

  const p = {
    numPes: this.filtros.numPes || null,
    usuario: this.filtros.usuario || null,
    sector: this.filtros.sector?.value || null,
    gerencia: this.filtros.gerencia?.value || null,
    fechaInicio: formatear(this.filtros.desde),
    fechaFin: formatear(this.filtros.hasta)
  };

  this.reporteService.consultar(p).subscribe(data => {
    this.resultados = data;
    this.cd.detectChanges();
  });
}
}