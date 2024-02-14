import {CURRENCIES_ENUM} from "./app.enum";

export interface IHeaderData {
    currency: CURRENCIES_ENUM;
    value: number;
}

export interface IResponseCurrencies {
    result: string;
    conversion_rates: ICurrencies;
}

export interface IResponseConversion {
    result: string;
    conversion_rate: number;
}

export interface ICurrencies {
    [key: string]: number;
}

export interface IConversionData {
    leftCurrencyValue: number;
    leftCurrentCurrency: CURRENCIES_ENUM;
    rightCurrencyValue: number;
    rightCurrentCurrency: CURRENCIES_ENUM;
}

export interface IConversionCurrencyData {
    from: CURRENCIES_ENUM;
    to: CURRENCIES_ENUM;
    value: number;
    changedKey?: string;
}
