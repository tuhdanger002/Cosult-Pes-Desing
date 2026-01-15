import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportePesDetalle } from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  // Asegúrate de que este puerto sea el que ves en Visual Studio
  private apiUrl = 'https://localhost:7063/api/Reportes/buscar';

  constructor(private http: HttpClient) {}

 consultar(filtros: any): Observable<ReportePesDetalle[]> {
  let params = new HttpParams();
  
  if (filtros.numPes) params = params.set('numPes', filtros.numPes);
  if (filtros.usuario) params = params.set('usuario', filtros.usuario);
  if (filtros.sector) params = params.set('sector', filtros.sector);
  if (filtros.gerencia) params = params.set('gerencia', filtros.gerencia);
  
  // Estos nombres deben coincidir EXACTAMENTE con los parámetros de tu C#
  if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);

  return this.http.get<ReportePesDetalle[]>(this.apiUrl, { params });
}
}