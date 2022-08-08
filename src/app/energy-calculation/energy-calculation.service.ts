import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnergyCalculationService {
  private api =
    'https://60498463fb5dcc001796a1fd.mockapi.io/api/v1/getCategory';

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
