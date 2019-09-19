import { Component, ViewChild, OnInit, AfterViewInit, HostListener } from '@angular/core';

import { TranslationService } from '@cemex-core/angular-localization-v7'; //updated from v1
import { ILanguage } from '../../../data/language-interface';

@Component({
  selector: 'language-component',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  constructor(private ts: TranslationService,) {}

 languages: ILanguage[];

  ngOnInit() {
    this.ts.getLanguages().subscribe(value =>{
      this.languages = value;
    });
    console.log("Estos son los lenguajes:");
    console.log(this.languages);
  }

  protected translate(key: string): string {
      return this.ts.pt(key);
  }

  changeLanguage(language: string) {
      sessionStorage.setItem('language', language);
      this.ts.setLanguage(language);
  }


}
