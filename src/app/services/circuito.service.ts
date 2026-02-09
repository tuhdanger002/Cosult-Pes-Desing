import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Circuito } from '../models/circuito.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CircuitoService {
    private apiUrl = `${environment.apiUrl}api/Circuitos`;

    constructor(private http: HttpClient) { }

    getCircuitos(): Observable<Circuito[]> {
        return this.http.get<Circuito[]>(this.apiUrl);
    }

    updateCircuito(id: number, circuito: Circuito): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, circuito);
    }
}