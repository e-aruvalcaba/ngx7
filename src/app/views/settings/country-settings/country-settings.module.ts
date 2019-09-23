import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountrySettingsRoutingModule } from './country-settings-routing.module';
import { CountrySettingsComponent } from './country-settings.component';
import { lazySharedConfig, lazySettingsSharedConfig, LazyModuleShared } from '../../../lazyshared.module';
import { sharedConfig, AppModuleShared} from 'src/app/shared.module';
import { CmxCalendarModule } from '../../calendar/cmx-calendar/cmx-calendar.module';

@NgModule({
  declarations: [CountrySettingsComponent],
  providers:[sharedConfig.providers],
  imports: [
    CommonModule,
    CountrySettingsRoutingModule,
    lazySettingsSharedConfig.imports,
    // CmxCalendarModule
    // FlexLayoutModule,
    // CmxDropdownModule,
    // CmxDatepickerModule,
    // CmxDialogModule,
    // AlertModule,
    // CmxFormFieldModule,
    // CmxTooltipModule,
    // FormsModule,
    // CmxTabsModule
  ]
})
export class CountrySettingsModule { }