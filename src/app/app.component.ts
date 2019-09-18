import { Component, ViewChild, OnInit } from '@angular/core';
import { CmxSidebarComponent, ICustomSubOption } from '@cemex/cmx-sidebar-v7';
import { Broadcaster } from '@cemex-core/events-v7';

import { TranslationService } from '@cemex-core/angular-localization-v7';

@Component({
  selector: 'app-component',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public header = 'UMD Demo';

  @ViewChild(CmxSidebarComponent)
  sidebar: CmxSidebarComponent;

  public sidebarOption;
  public selectedLanguage;

  constructor(private translationService: TranslationService, private eventBroadcaster: Broadcaster) {
    this.translationService.setLanguage('en_US');

    this.translationService.getSelectedLanguage().subscribe(language => {
      this.selectedLanguage = language;
      console.log('selectedLanguage', this.selectedLanguage);
    });
  }

  ngOnInit() {
    this.eventBroadcaster.on<string>(Broadcaster.DCM_APP_LOGOUT).subscribe(response => {
      console.log('do some stuff');
    });

    sessionStorage.setItem('my_session_storage', 'test value');
  }

  clickMenuButton(event: any) {
    this.sidebar.isCollapsed = !this.sidebar.isCollapsed;

    console.log('clickMenuButton, isCollapsed:', this.sidebar.isCollapsed);
  }

  public collapseEvent(collapsed: boolean) {
    console.log('sidebar is collapsed:', collapsed);
  }

  public customOptionEvent(value: ICustomSubOption) {
    console.log('you clicked on:', value);
  }
}
