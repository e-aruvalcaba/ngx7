import { CmxCheckboxModule } from '@cemex/cmx-checkbox-v4';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CORE_COMMON_PROVIDERS } from '@cemex-core/angular-services-v7';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CmxButtonModule } from '@cemex/cmx-button-v4/dist';

@NgModule({
  imports: [CmxButtonModule, CommonModule, FlexLayoutModule, CmxCheckboxModule],
  exports: [CmxButtonModule],
  providers: [CORE_COMMON_PROVIDERS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestModule {}
