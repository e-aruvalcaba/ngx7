import { Component } from '@angular/core';
import { TranslationService } from '@cemex-core/angular-localization-v7';
import { FeatureToggleService } from './../../services/feature.service';

@Component({
  templateUrl: './test.component.html'
})
export class TestComponent {
  constructor(private ft: FeatureToggleService, public translationService: TranslationService) {
    this.translationService.setLanguage('en_US');
    // console.log(FeatureToggleService.all());
    console.log(this.ft.feature('documents.sample.step1'));
    console.log(this.ft.feature('documents.sample.step2'));
    console.log(this.ft.feature('documents.sample.step3'));
    console.log(this.ft.feature('documents.sample.step4'));
    console.log(this.ft.feature('documents.sample.step5'));
    console.log(this.ft.feature('documents.sample.step6'));
  }
}
