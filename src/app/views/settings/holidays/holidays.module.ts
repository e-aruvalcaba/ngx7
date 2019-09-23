import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidaysRoutingModule } from './holidays-routing.module';
import { HolidaysComponent } from './holidays.component';
import { LazyModuleShared } from '../../../lazyshared.module';
import { sharedConfig } from 'src/app/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmxFormFieldModule } from '@cemex/cmx-form-field-v4';
import { DatepickerInputModule } from '@cemex/cmx-datepicker-input-v2';
import { CmxDatepickerModule } from '@cemex/cmx-datepicker-v4';
import { CmxDropdownModule } from '@cemex/cmx-dropdown-v4';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AlertModule, AlertService } from '@cemex/cmx-alert-v7';
import { CmxTableModule } from '@cemex/cmx-table-v7';
import { CmxDialogModule } from '@cemex/cmx-dialog-v7';
import { CmxButtonModule } from '@cemex/cmx-button-v4';
import { CmxFlugeeModule, CmxFlugeeService } from '@cemex/cmx-flugee-v7';


@NgModule({
  declarations: [HolidaysComponent],
  providers:[sharedConfig.providers, AlertService, CmxFlugeeService],
  imports: [
    CommonModule,
    HolidaysRoutingModule,
    FlexLayoutModule,
    CmxDropdownModule,
    CmxFormFieldModule,
    CmxDatepickerModule,
    DatepickerInputModule,
    CmxFormFieldModule,
    ReactiveFormsModule,
    AlertModule,
    FormsModule,
    CmxTableModule,
    CmxDialogModule,
    CmxButtonModule,
    CmxFlugeeModule
  ]
})
export class HolidaysModule { }
