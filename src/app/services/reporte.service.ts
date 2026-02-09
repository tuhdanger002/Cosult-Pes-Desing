import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportePesDetalle } from '../models/reporte.model';
// Importamos el environment. Angular decidirá cuál usar (dev o prod) al compilar
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  // La URL base se toma automáticamente del archivo de environment
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Consulta para Aprobados y Cancelados (Endpoint: /buscar)
   */
  consultar(filtros: any): Observable<ReportePesDetalle[]> {
    const params = this.definirParametros(filtros);
    return this.http.get<ReportePesDetalle[]>(`${this.baseUrl}/buscar`, { params });
  }

  /**
   * Consulta para la ventana de PENDIENTES (Endpoint: /buscar2)
   */
  consultarPendientes(filtros: any): Observable<ReportePesDetalle[]> {
    const params = this.definirParametros(filtros);
    return this.http.get<ReportePesDetalle[]>(`${this.baseUrl}/buscar2`, { params });
  }

  /**
   * Método privado para procesar los filtros y convertirlos en parámetros de URL
   */
  private definirParametros(filtros: any): HttpParams {
    let params = new HttpParams();

    // Solo agregamos el parámetro si tiene un valor real
    if (filtros.numPes) params = params.set('numPes', filtros.numPes.toString());
    if (filtros.usuario) params = params.set('usuario', filtros.usuario);
    if (filtros.sector) params = params.set('sector', filtros.sector);
    if (filtros.gerencia) params = params.set('gerencia', filtros.gerencia);
    if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);

    return params;
  }
}