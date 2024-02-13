import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_KEY = 'd35e0bb274c9f0325194ae34';

  constructor(
    private http: HttpClient
  ) {
    console.log(this.http);
  }

  public getCurrentRate(): Observable<any> {
    return of(1);
  }

  public pairConversion(): Observable<any> {
    return this.http.get(`https://v6.exchangerate-api.com/v6/${this.API_KEY}/pair/EUR/GBP`);
  }
}
