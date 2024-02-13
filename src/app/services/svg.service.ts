import { Injectable } from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {REFRESH_SVG, CONVERSION_SVG} from '../shared/app.constants';

@Injectable({
    providedIn: 'root',
})
export class SvgService {
    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) {

    }

    public init(): void {
        this.iconRegistry.addSvgIconLiteral('refresh', this.sanitizer.bypassSecurityTrustHtml(REFRESH_SVG));
        this.iconRegistry.addSvgIconLiteral('conversion', this.sanitizer.bypassSecurityTrustHtml(CONVERSION_SVG));
    }
}
