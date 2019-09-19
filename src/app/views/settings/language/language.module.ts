import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lazySharedConfig } from '../../../lazyshared.module';
import { LanguageRoutingModule } from './language-routing.module';
import { LanguageComponent } from './language.component';

@NgModule({
  declarations: [LanguageComponent],
  imports: [
    CommonModule,
    LanguageRoutingModule,
    lazySharedConfig.imports
  ]
})
export class LanguageModule { }
