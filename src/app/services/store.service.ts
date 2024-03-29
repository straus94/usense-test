import { Injectable } from '@angular/core';
import {CURRENCIES_ENUM} from '../shared/app.enum';
import {IConversionCurrencyData, IConversionData, IHeaderData} from '../shared/app.interfaces';
import {BehaviorSubject, Observable, map} from 'rxjs';
import {ApiService} from './api.service';
import {LEFT_CURRENCY_VALUE, MAIN_CURRENCY} from '../shared/app.constants';

const initialFormData: IConversionData = {
    leftCurrencyValue: 0,
    leftCurrentCurrency: CURRENCIES_ENUM.UAH,
    rightCurrencyValue: 0,
    rightCurrentCurrency: CURRENCIES_ENUM.USD
}

@Injectable({
    providedIn: 'root',
})
export class StoreService {

    private headerData: BehaviorSubject<IHeaderData[]> = new BehaviorSubject<IHeaderData[]>([]);
    public headerData$: Observable<IHeaderData[]> = this.headerData.asObservable();

    private conversionData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public conversionData$: Observable<any> = this.conversionData.asObservable();

    private formData: BehaviorSubject<IConversionData> = new BehaviorSubject<IConversionData>(initialFormData);
    public formData$: Observable<IConversionData> = this.formData.asObservable();

    private changedKey: string = LEFT_CURRENCY_VALUE;

    constructor(
        private apiService: ApiService
    ) {}

    public initHeaderData(): void {
        this.apiService.getCurrentRating().pipe(
            map(data => {
                return Object.keys(CURRENCIES_ENUM).filter(currency => currency !== MAIN_CURRENCY).map(item => {
                    const roundedNumber = (1 / data.conversion_rates[item] * 100) / 100;
                    return {
                        currency: item as CURRENCIES_ENUM,
                        value: roundedNumber
                    }
                });
            })
        ).subscribe(resp => {
            this.headerData.next(resp);
        });
    }

    public conversionCurrency(data: IConversionCurrencyData, formValue: IConversionData): void {
        const {from, to} = data;

        this.apiService.pairConversion(from, to).subscribe(resp => {
            this.formData.next({
                ...formValue,
                [data.changedKey || this.changedKey]: (data.value * resp.conversion_rate)
            })


            if (data.changedKey) {
                this.changedKey = data.changedKey;
            }
        })
    }

    public changeCurrency(data: {changedKey: string, value: CURRENCIES_ENUM}): void {
        this.formData.next({
            ...this.formData.value,
            [data.changedKey]: data.value
        });
    }

    public switchCurrency(data: {leftCurrentCurrency: CURRENCIES_ENUM, rightCurrentCurrency: CURRENCIES_ENUM}): void {
        this.formData.next({
            ...this.formData.value,
            ...data
        });
    }
}
