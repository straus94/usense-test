import {Component} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {ConversionComponent} from './components/conversion/conversion.component';
import {SvgService} from './services/svg.service';
import {StoreService} from './services/store.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [HeaderComponent, ConversionComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'usens-test';

    constructor(
        private svgService: SvgService,
        private storeService: StoreService
    ) {
        this.svgService.init();
        this.storeService.initHeaderData();
    }
}
