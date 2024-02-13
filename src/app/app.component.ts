import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { HeaderComponent } from './components/header/header.component';
import { ConversionComponent } from './components/conversion/conversion.component';
import { CommonModule } from '@angular/common';
import {SvgService} from './services/svg.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        private apiService: ApiService,
        private svgService: SvgService
    ) {
        // this.apiService.pairConversion().subscribe(v => console.log(v));
        this.svgService.init();
    }
}
