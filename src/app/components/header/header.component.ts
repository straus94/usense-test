import {CURRENCIES_ENUM} from './../../shared/app.enum';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule, } from '@angular/material/icon';
import {MAIN_CURRENCY} from '../../shared/app.constants';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {IHeaderData} from '../../shared/app.interfaces';
import {StoreService} from '../../services/store.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatToolbarModule, MatIconModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

    public currencies = CURRENCIES_ENUM;
    public headerCurrencies = Object.keys(CURRENCIES_ENUM).filter(currency => currency !== MAIN_CURRENCY);
    public headerData: Observable<IHeaderData[]> = this.storeService.headerData$;

    constructor(
        private storeService: StoreService
    ) {
    }

    public refresh(): void {
        this.storeService.initHeaderData();
    }
}
