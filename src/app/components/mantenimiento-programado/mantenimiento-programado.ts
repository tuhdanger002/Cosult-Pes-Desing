import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CircuitoService } from '../../services/circuito.service';
import { ReporteService } from '../../services/reporte.service';
import { MantenimientoService, MaintenanceSchedule } from '../../services/mantenimiento.service';
import { Circuito } from '../../models/circuito.model';
import { ReportePesDetalle } from '../../models/reporte.model';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-mantenimiento-programado',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './mantenimiento-programado.html',
    styleUrl: './mantenimiento-programado.css'
})
export class MantenimientoProgramadoComponent implements OnInit {
    circuitos: Circuito[] = [];
    selectedCircuito: string = '';
    selectedCircuitoNombre: string = '';

    dias = ['Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    horas = Array.from({ length: 24 }, (_, i) => i);

    // Grid data: [dayIndex][hour] = { type: 'none' | 'manual' | 'pes' }
    grid: { type: 'none' | 'manual' | 'pes' }[][] = [];

    pesData: ReportePesDetalle[] = [];

    constructor(
        private circuitoService: CircuitoService,
        private reporteService: ReporteService,
        private mantenimientoService: MantenimientoService
    ) {
        this.initGrid();
    }

    ngOnInit() {
        this.loadCircuitos();
    }

    initGrid() {
        this.grid = this.dias.map(() =>
            this.horas.map(() => ({ type: 'none' }))
        );
    }

    loadCircuitos() {
        this.circuitoService.getCircuitos().subscribe(data => {
            this.circuitos = data.filter(c => c.estado === 'Activo');
        });
    }

    onCircuitoChange() {
        const circuito = this.circuitos.find(c => c.smt === this.selectedCircuito);
        this.selectedCircuitoNombre = circuito ? (circuito.nombre || '') : '';
        this.loadData();
    }

    loadData() {
        if (!this.selectedCircuito) return;

        this.initGrid();

        // Fetch PES data and Manual data
        forkJoin({
            pes: this.reporteService.consultar({ sector: this.selectedCircuito }), // Assuming sector might match
            manual: this.mantenimientoService.getSchedules(this.selectedCircuito)
        }).subscribe(({ pes, manual }) => {
            this.pesData = pes;
            this.applyPesData(pes);
            this.applyManualData(manual);
        });
    }

    applyPesData(pes: ReportePesDetalle[]) {
        pes.forEach(p => {
            const start = new Date(p.FECHA_INICIO);
            const end = new Date(p.FECHA_FIN);

            // Basic implementation for weekly view (this would need more robust date handling for real week matching)
            // For now, let's assume if it falls within the current week's days
            // This is a simplified logic for the 24h grid
            const day = start.getDay(); // 0-6 (Sun-Sat)
            const startHour = start.getHours();
            const endHour = end.getHours();

            // Convert standard getDay() to our dias array index (Sat=0, Sun=1, etc)
            let dayIndex = (day + 1) % 7;

            for (let h = startHour; h <= endHour; h++) {
                if (this.grid[dayIndex] && this.grid[dayIndex][h]) {
                    this.grid[dayIndex][h].type = 'pes';
                }
            }
        });
    }

    applyManualData(manual: MaintenanceSchedule[]) {
        manual.forEach(m => {
            const dayIndex = this.dias.indexOf(m.day);
            if (dayIndex !== -1 && this.grid[dayIndex][m.hour].type === 'none') {
                this.grid[dayIndex][m.hour].type = 'manual';
            }
        });
    }

    toggleHour(dayIndex: number, hour: number) {
        if (this.grid[dayIndex][hour].type === 'pes') return; // Cannot toggle PES

        this.grid[dayIndex][hour].type = this.grid[dayIndex][hour].type === 'manual' ? 'none' : 'manual';
        this.saveManualSchedules();
    }

    saveManualSchedules() {
        const manualIndices: MaintenanceSchedule[] = [];
        this.grid.forEach((dayRow, dIdx) => {
            dayRow.forEach((cell, hIdx) => {
                if (cell.type === 'manual') {
                    manualIndices.push({
                        day: this.dias[dIdx],
                        hour: hIdx,
                        type: 'manual'
                    });
                }
            });
        });
        this.mantenimientoService.saveSchedules(this.selectedCircuito, manualIndices);
    }

    getDuracion(dayIndex: number): number {
        return this.grid[dayIndex].filter(c => c.type !== 'none').length;
    }

    borrarTodo() {
        if (confirm('¿Está seguro de borrar todos los mantenimientos manuales?')) {
            this.grid.forEach(row => row.forEach(cell => {
                if (cell.type === 'manual') cell.type = 'none';
            }));
            this.saveManualSchedules();
        }
    }
}
