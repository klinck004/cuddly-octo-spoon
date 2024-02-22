import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BpService {

  constructor(private http: HttpClient) { }
  private baseURL = 'http://localhost:3000/api'
  
  getAll(): Observable<any> {
    return this.http.get(`${this.baseURL}/entries`)
  }
  addData(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/add`, data)
  }
}
