// import { Component, ViewChild, OnInit } from '@angular/core';
import { CmxSidebarComponent, ICustomOption, IApplicationMenu, ICustomSubOption } from '@cemex/cmx-sidebar-v7';
import { Broadcaster } from '@cemex-core/events-v7';
import { TranslationService } from '@cemex-core/angular-localization-v7';
import { Component, ViewChild, OnInit, AfterViewInit, HostListener, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '@cemex-core/angular-services-v7';
import { CnxGblOrgService } from '../app/services/cnx-gbl-org.service';
import { SecurityService } from '../app/services/security.service';
import { ApplicationMenu } from '../app/models/menu';
import { VersionToggle } from '../app/services/versionToggle.service';

//Updated to v7 from v4
// import { CmxSidebarComponent, ICustomOption, ICustomSubOption, IApplicationMenu } from '@cemex/cmx-sidebar-v4/dist';import { IAppMenuItem, IUserProfile, ICustomer, ILegalEntity } from "@cemex-core/types-v2/dist/index.interface";
// import { Broadcaster } from '@cemex-core/events-v1/dist';
// import { TranslationService } from '@cemex-core/angular-localization-v1/dist';


@Component({
  selector: 'app-component',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

// export class AppComponent implements OnInit {
//   public header = 'UMD Demo';

//   @ViewChild(CmxSidebarComponent)
//   sidebar: CmxSidebarComponent;

//   public sidebarOption;
//   public selectedLanguage;

//   constructor(private translationService: TranslationService, private eventBroadcaster: Broadcaster) {
//     this.translationService.setLanguage('en_US');

//     this.translationService.getSelectedLanguage().subscribe(language => {
//       this.selectedLanguage = language;
//       console.log('selectedLanguage', this.selectedLanguage);
//     });
//   }

//   ngOnInit() {
//     this.eventBroadcaster.on<string>(Broadcaster.DCM_APP_LOGOUT).subscribe(response => {
//       console.log('do some stuff');
//     });

//     sessionStorage.setItem('my_session_storage', 'test value');
//   }

//   clickMenuButton(event: any) {
//     this.sidebar.isCollapsed = !this.sidebar.isCollapsed;

//     console.log('clickMenuButton, isCollapsed:', this.sidebar.isCollapsed);
//   }

//   public collapseEvent(collapsed: boolean) {
//     console.log('sidebar is collapsed:', collapsed);
//   }

//   public customOptionEvent(value: ICustomSubOption) {
//     console.log('you clicked on:', value);
//   }
// }

export class AppComponent implements OnInit {

  public customMenuItems: IApplicationMenu[];
  protected versionToggle: VersionToggle;

  private customSideBar = true;

  //  This property is for control of shade screen
  private waiting = false;

  //  To know is the sidebar is collapsed
  private collapsed = true;

  //  Indicates the window inner width
  private width: number;

  @ViewChild(CmxSidebarComponent)
  sidebar: CmxSidebarComponent;

  public sidebarOption;
  public selectedLanguage;

  /**
   * Listen on event resize
   *
   * @param event Resize event argument
   */
  @HostListener("window:resize", ["$event"])
  public onResize(event: any): void {
    let previousWidth = this.width;
    this.width = window.innerWidth;
    if (this.width > 1080) {
      this.sidebar.isCollapsed = true;
    } else {
      if (previousWidth > 1080) {
        this.sidebar.isCollapsed = true;
      } // end if previous width > 1080
    } // end if this width > 1080
  } // end onResize

  constructor(private sessionService: SessionService,
    private eventBroadcaster: Broadcaster,
    private api: CnxGblOrgService,
    private ts: TranslationService,
    private securityService: SecurityService,
    injector: Injector
  ) {

    //FROM NEW BOILERPLATE ----------------------------------
    this.ts.setLanguage('en_US');

    this.ts.getSelectedLanguage().subscribe(language => {
      // debugger;
      this.selectedLanguage = language;
      console.log('selectedLanguage', this.selectedLanguage);
    });
    //--------------------------------------------------------

    this.versionToggle = injector.get(VersionToggle);
  } // end function constructor

  public CurrentMenu: ApplicationMenu[];

  ngOnInit() {
    this.api.auth();
    this.ts.setLanguage(sessionStorage.getItem('language'));
    this.api.getWaitingStatus().subscribe(
      isAwaiting => { this.waiting = isAwaiting }
    ); // end subscribe

    this.eventBroadcaster.on<string>(Broadcaster.DCM_APP_LOGOUT)
      .subscribe((response) => {
      });

    this.securityService.OnMenuChange.subscribe({
      next: (event: ApplicationMenu[]) => {
        this.CurrentMenu = event;
        this.customMenuItems = [];
        for (let appMenu of this.CurrentMenu) {
          let group: IApplicationMenu = {
            applicationIcon: appMenu.applicationIcon,
            applicationMenuId: 0,
            applicationTitle: appMenu.applicationTitle,
            applicationUrl: appMenu.applicationUrl,
            applicationPwdRecUrl: "",
            applicationUsrRegUrl: "",
            applicationUsrHlpUrl: "",
            applicationCustomIcon: true,
            menu: {
              menuId: 0,
              menuTitle: "",
              menuEndpoint: "",
              menuItems: []
            }
          }; // end IApplicationMenu

          for (let menu of appMenu.menu.menuItems) {
            group.menu.menuItems.push({
              menuId: menu.menuId,
              menuTitle: menu.menuTitle,
              menuEndpoint: menu.menuEndpoint,
              menuItems: []
            });
          } // end for each menu
          this.customMenuItems.push(group);
        } // end for each app menu

        if (this.securityService.isViewOnly()) {
          let fleetGroup: any = this.customMenuItems.filter(m => m.applicationTitle == "rccc.menues.fleet_constraints")[0];
          fleetGroup.menu.menuItems.push({
            menuId: 5795,
            menuTitle: "rccc.menues.fleet_constraints.fleet_capacity",
            menuEndpoint: "/rccc/flco/fleet-capacity",
            menuItems: []
          }); // end add menu items
        } // end if is viewOnly

        this.adjustStyles();
      } // end next


    });

    this.width = window.innerWidth;

    this.sidebar.isCollapsed = true;

    this.eventBroadcaster.on(Broadcaster.DCM_LANGUAGE_CHANGE).subscribe(() => {
      let language = sessionStorage.getItem('language');
      this.ts.setLanguage(language);
    });

    this.checkNormalizedVersion();

    //-------------- FROM NEW BOILER PLATE ---------------------------------------------
    this.eventBroadcaster.on<string>(Broadcaster.DCM_APP_LOGOUT).subscribe(response => {
      console.log('do some stuff');
    });

    sessionStorage.setItem('my_session_storage', 'test value');
    //----------------------------------------------------------------------------------
  };// end ngonInit

  ngAfterViewInit() {
  } // end ngAfterViewInit

  //----------------- FROM OLDER BOILER PLATE--------------------------------
  //-------------------------------------------------------------------------
  // clickMenuButton(event: any) {
  //   this.sidebar.isCollapsed = !this.sidebar.isCollapsed;
  // }

  // private collapseEvent(collapsed: boolean) {
  //   if (this.width < 1080) {
  //     this.collapsed = !collapsed;
  //   } else {
  //     this.collapsed = collapsed;
  //   }
  // }

  // private customOptionEvent(value: ICustomSubOption) {
  // }
  //-----------------------------------------------------------------------
  //----------------- ENDS FROM OLDER BOILER PLATE-------------------------


  //----------------- FROM NEW BOILER PLATE--------------------------------
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
    //----------------- ENDS FROM NEW BOILER PLATE--------------------------------

  private activeMenu: string;

  private setMenu(menu: string) {
    this.activeMenu = menu;
  } // end function setMenu

  /**
   * Returns translation
   *
   * @param key The key to look for in the locales files
   *
   * @return string
   */
  protected translate(key: string): string {
    return this.ts.pt(key);
  } // end function translate

  private getDataId(url: string): string {
    if (!url) {
      return "";
    } // end if not url
    let parts: string[] = url.split('/');
    let result = parts.join('-');
    return result;
  } // end function get menu description

  private adjustStyles() {

    if (window["adjustStyles"]) {
      window["adjustStyles"]();
    } else {
      console.error("Window does not have adjustStyles");
    }// end if adjustStyles
  } // end function adjustStyles

  private setNormalizedVersion(): void {

    console.log("Normalized version");
    sessionStorage.setItem("normalization", '1');
    this.versionToggle.setIsNormalized(true);
  } // end function setNormalized

  private setDenormalizedVersion(error: any): void {

    console.warn("Denormalized version", error);
    sessionStorage.setItem("normalization", '0');
    this.versionToggle.setIsNormalized(false);
  } // end function setNormalized

  /**
   * Validates normalization version
   */
  private checkNormalizedVersion(): void {
    this.api.await();
    this.api.validateV3().subscribe(
      response => {
        if (this.versionToggle.isSettingsEnabled()) {
          this.setNormalizedVersion();
        } else {
          this.setDenormalizedVersion('Country V1');
        } // end if settings enabled
        this.api.stopWaiting();
      }, // end response
      error => {
        if (error.hasOwnProperty('status') && error.status == 404) {
          this.setDenormalizedVersion(error);
        } else {
          if (this.versionToggle.isSettingsEnabled()) {
            this.setNormalizedVersion();
          } // end if settings enabled
        } // end if status is 404
        this.api.stopWaiting();
      } // end error
    ); // end subscribe
  } // end function checkNormalizationVersion
} // end class
