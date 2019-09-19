import { NgModule, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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
import { StagingComponent } from './staging.component';

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
export class AppModule implements OnInit{

  ngOnInit(){

    //Set local environment variables
    //  Window['API_HOST_MW'] ='https://uscldcnxapmd01.azure-api.net/'
    //  Window['API_HOST'] ='https://uscldcnxapmd01.azure-api.net/'
    //  Window['API_HOST_FULL'] = 'https://uscldcnxapmd01.azure-api.net/'
    //  Window['APP_CODE']='OrderProductCat_App'
    //  Window['CLIENT_ID'] = 'dd2ee55f-c93c-4c1b-b852-58c18cc7c277'
    //  Window['DUMMY_KEY_FOR_LOCAL'] = 'yes';
    // //  Window['TRANSLATE_URL'] = 'https://configuration-console.cemexgo.com/'
    //  Window['BASE_URL'] = 'NGX-BOILERPLATE/'
  }
}
