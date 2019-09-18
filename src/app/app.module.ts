import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { sharedConfig } from './shared.module';
import { FeatureToggleService } from './services/feature.service';
import { AuthGuard, CountryConfigService, SessionService, ProjectSettings } from '@cemex-core/angular-services-v7';
import { HttpCemex } from '@cemex-core/angular-services-v7';
import { Broadcaster } from '@cemex-core/events-v7';
import { TranslationService, LocaleService, FormatterService } from '@cemex-core/angular-localization-v7';
import { httpFactory } from './http.factory';
import { HttpClient, HttpHandler } from '@angular/common/http';

@NgModule({
  bootstrap: sharedConfig.bootstrap,
  declarations: sharedConfig.declarations,
  providers: [
    sharedConfig.providers,
    AuthGuard,
    TranslationService,
    LocaleService,
    FormatterService,
    HttpCemex,
    {
      provide: HttpClient,
      useFactory: httpFactory,
      deps: [HttpHandler]
    },
    SessionService,
    ProjectSettings,
    CountryConfigService,
    Broadcaster,
    { provide: 'TRANSLATION_PRODUCT_PATH', useValue: 'user-provisioning' },
    { provide: 'TRANSLATION_LANGUAGES', useValue: window['CMX_LANGUAGES'] },
    { provide: 'DEFAULT_LANGUAGE_ISO', useValue: 'en_US' },
    FeatureToggleService
  ],
  imports: [sharedConfig.imports, BrowserModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
