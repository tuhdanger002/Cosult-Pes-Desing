import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportePesDetalle } from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  // URL base del controlador
  private baseUrl = 'https://localhost:7063/api/Reportes';

  constructor(private http: HttpClient) { }

  /**
   * Consulta para Aprobados y Cancelados
   */
  consultar(filtros: any): Observable<ReportePesDetalle[]> {
    const params = this.definirParametros(filtros);
    return this.http.get<ReportePesDetalle[]>(`${this.baseUrl}/buscar`, { params });
  }

  /**
   * Nueva consulta para la ventana de PENDIENTES
   */
  consultarPendientes(filtros: any): Observable<ReportePesDetalle[]> {
    const params = this.definirParametros(filtros);
    return this.http.get<ReportePesDetalle[]>(`${this.baseUrl}/buscar2`, { params });
  }

  /**
   * Método privado para no repetir la lógica de los parámetros
   */
  private definirParametros(filtros: any): HttpParams {
    let params = new HttpParams();

    if (filtros.numPes) params = params.set('numPes', filtros.numPes);
    if (filtros.usuario) params = params.set('usuario', filtros.usuario);
    if (filtros.sector) params = params.set('sector', filtros.sector);
    if (filtros.gerencia) params = params.set('gerencia', filtros.gerencia);
    if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);

    return params;
  }
}