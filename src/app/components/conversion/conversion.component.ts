import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CURRENCIES_ENUM } from '../../shared/app.enum';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {Subject, combineLatest, debounceTime, filter, map, merge, of, switchMap, takeUntil, withLatestFrom} from 'rxjs';
import {StoreService} from '../../services/store.service';
import {IConversionCurrencyData, IConversionData} from '../../shared/app.interfaces';
import {tapOnce} from '../../core/rx-operators/tap-once.operator';
import {LEFT_CURRENCT_CURRENCY, LEFT_CURRENCY_VALUE, RIGHT_CURRENCT_CURRENCY, RIGHT_CURRENCY_VALUE} from '../../shared/app.constants';

@Component({
    selector: 'app-conversion',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        CommonModule,
        MatIconModule,
    ],
    templateUrl: './conversion.component.html',
    styleUrl: './conversion.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionComponent implements OnInit, OnDestroy {

    public form: FormGroup;
    public currencies = Object.keys(CURRENCIES_ENUM);

    private destroy: Subject<boolean> = new Subject<boolean>();

    constructor(private storeService: StoreService) {}

    ngOnInit(): void {
        this.storeService.formData$.pipe(
            tapOnce((data: IConversionData) => this.initForm(data)),
            takeUntil(this.destroy)
        ).subscribe(formData => {
            this.form.patchValue(formData, {emitEvent: false});
        })

        this.setSubscriptions();
    }

    ngOnDestroy(): void {
        this.destroy.next(true);
        this.destroy.complete();
    }

    private initForm(data: IConversionData): void {
        this.form = new FormGroup({
            leftCurrencyValue: new FormControl<number>(data.leftCurrencyValue, [Validators.required, Validators.min(0)]),
            leftCurrentCurrency: new FormControl<CURRENCIES_ENUM>(data.leftCurrentCurrency),
            rightCurrencyValue: new FormControl<number>(data.leftCurrencyValue, Validators.min(0)),
            rightCurrentCurrency: new FormControl<CURRENCIES_ENUM>(data.rightCurrentCurrency),
        });
    }

    private setSubscriptions(): void {

        merge(
            this.leftCurrencyValueControl.valueChanges.pipe(switchMap(value => of({changedKey: RIGHT_CURRENCY_VALUE, field: LEFT_CURRENCT_CURRENCY, value}))),
            this.rightCurrencyValueControl?.valueChanges.pipe(switchMap(value => of({changedKey: LEFT_CURRENCY_VALUE, field: RIGHT_CURRENCT_CURRENCY, value}))),
        ).pipe(
            filter(item => item.value !== null),
            debounceTime(500),
            takeUntil(this.destroy),
            filter(() => this.form.valid)
        ).subscribe(item => {
            const from = item.changedKey === RIGHT_CURRENCY_VALUE ? this.form.value[LEFT_CURRENCT_CURRENCY] : this.form.value[RIGHT_CURRENCT_CURRENCY];
            const to = item.changedKey === RIGHT_CURRENCY_VALUE ? this.form.value[RIGHT_CURRENCT_CURRENCY] : this.form.value[LEFT_CURRENCT_CURRENCY];

            const data: IConversionCurrencyData = {
                from,
                to,
                changedKey: item.changedKey,
                value: item.value
            }

            console.log(this.form);
            if (this.form.invalid) {
                return;
            }

            this.storeService.conversionCurrency(data, this.form.value)
        });

        // this.leftCurrentCurrencyControl.valueChanges.pipe(takeUntil(this.destroy)).subscribe(value => {

        // });

        merge(
            this.leftCurrentCurrencyControl.valueChanges.pipe(switchMap(value => of({changedKey: LEFT_CURRENCT_CURRENCY, value}))),
            this.rightCurrentCurrencyControl.valueChanges.pipe(switchMap(value => of({changedKey: RIGHT_CURRENCT_CURRENCY, value})))
        ).pipe(takeUntil(this.destroy)).subscribe((item) => {
            console.log(item);

            this.storeService.changeCurrency(item);
            const data: IConversionCurrencyData = this.parseValueFromCurrencyControl(item.changedKey, item.value)
            console.log(this.form.value);
            console.log(data);

            this.storeService.conversionCurrency(data, this.form.value)

            // this.storeService.conversionCurrency(data, this.form.value)
        })
    }

    private parseValueFromCurrencyControl(currentField: string, value: CURRENCIES_ENUM): IConversionCurrencyData {
        const to = currentField === LEFT_CURRENCT_CURRENCY ? this.form.value.rightCurrentCurrency : this.form.value.leftCurrentCurrency;
        const fromValue = currentField === LEFT_CURRENCT_CURRENCY ? this.form.value.leftCurrencyValue : this.form.value.rightCurrencyValue;
        const changedKey = currentField === LEFT_CURRENCT_CURRENCY ? RIGHT_CURRENCY_VALUE : LEFT_CURRENCY_VALUE

        return {
            from: value,
            to: to,
            value: fromValue,
            changedKey
        }
    }

    public switchCurrency(): void {
        const rightCurrentCurrency = this.leftCurrentCurrencyControl?.value;
        const leftCurrentCurrency = this.rightCurrentCurrencyControl?.value;
        console.log(leftCurrentCurrency);
        console.log(rightCurrentCurrency);

        this.storeService.switchCurrency({
            leftCurrentCurrency,
            rightCurrentCurrency
        });

        const data: IConversionCurrencyData = {
            from: this.form.value.leftCurrentCurrency,
            to: this.form.value.rightCurrentCurrency,
            changedKey: RIGHT_CURRENCY_VALUE,
            value: this.form.value.leftCurrencyValue
        }

        this.storeService.conversionCurrency(data, this.form.value);
    }

    private get leftCurrentCurrencyControl(): AbstractControl<CURRENCIES_ENUM> {
        return this.form.get('leftCurrentCurrency') as AbstractControl<CURRENCIES_ENUM>;
    }

    private get rightCurrentCurrencyControl(): AbstractControl<CURRENCIES_ENUM> {
        return this.form.get('rightCurrentCurrency') as AbstractControl<CURRENCIES_ENUM>;
    }

    private get leftCurrencyValueControl(): AbstractControl<number> {
        return this.form.get('leftCurrencyValue') as AbstractControl<number>;
    }

    private get rightCurrencyValueControl(): AbstractControl<number> {
        return this.form.get('rightCurrencyValue') as AbstractControl<number>;
    }
}
