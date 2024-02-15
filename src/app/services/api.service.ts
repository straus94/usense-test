import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IResponseConversion, IResponseCurrencies} from '../shared/app.interfaces';
import {CURRENCIES_ENUM} from '../shared/app.enum';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly API_KEY = 'd35e0bb274c9f0325194ae34';
    private readonly BASE_URL = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/`;

    constructor(
        private http: HttpClient
    ) {}

    public getCurrentRating(): Observable<IResponseCurrencies> {
        return this.http.get<IResponseCurrencies>(`${this.BASE_URL}/latest/UAH`);
    }

    public pairConversion(from: CURRENCIES_ENUM, to: CURRENCIES_ENUM): Observable<IResponseConversion> {
        return this.http.get<IResponseConversion>(`${this.BASE_URL}/pair/${from}/${to}`);
    }
}
