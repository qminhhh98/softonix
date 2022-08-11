import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnergyCalculationService {
  private api =
    'https://localhost:7108/api/categories';

  constructor(private http: HttpClient) {}

  getListCategory(): Observable<any> {
    return this.http.get<any>(this.api, { observe: 'response' });
  }

  getCategoryInfo(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${categoryId}`, {
      observe: 'response',
    });
  }
}
