import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MaintenanceSchedule {
    day: string;
    hour: number;
    type: 'manual' | 'pes';
}

@Injectable({
    providedIn: 'root'
})
export class MantenimientoService {
    private storageKey = 'mantenimiento_programado';
    private schedulesSubject = new BehaviorSubject<{ [equipmentId: string]: MaintenanceSchedule[] }>({});

    constructor() {
        this.loadSchedules();
    }

    private loadSchedules() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.schedulesSubject.next(JSON.parse(data));
        }
    }

    getSchedules(equipmentId: string): Observable<MaintenanceSchedule[]> {
        return new Observable(observer => {
            this.schedulesSubject.subscribe(all => {
                observer.next(all[equipmentId] || []);
            });
        });
    }

    saveSchedules(equipmentId: string, schedules: MaintenanceSchedule[]) {
        const current = this.schedulesSubject.value;
        current[equipmentId] = schedules;
        localStorage.setItem(this.storageKey, JSON.stringify(current));
        this.schedulesSubject.next(current);
    }
}
