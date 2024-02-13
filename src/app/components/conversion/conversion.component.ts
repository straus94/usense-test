import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CURRENCIES } from '../../shared/app.enum';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
export class ConversionComponent implements OnInit {
    public form: FormGroup;
    public currencies = Object.keys(CURRENCIES);

    ngOnInit(): void {
        this.form = new FormGroup({
            leftCurrencyValue: new FormControl<string>('0', Validators.min(0)),
            leftCurrentCurrency: new FormControl<string>(CURRENCIES.UAH),
            rightCurrencyValue: new FormControl<string>('0', Validators.min(0)),
            rightCurrentCurrency: new FormControl<string>(CURRENCIES.USD),
        });
    }
}
