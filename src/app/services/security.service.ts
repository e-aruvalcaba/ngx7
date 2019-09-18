import { Injectable, EventEmitter } from "@angular/core";

import { SessionService } from '@cemex-core/angular-services-v7';

import { SessionStorageService } from '../services/session-storage.service';
import { Role } from '../models/Role';
import { RoleMenu } from '../models/RoleMenu';
import { ROLE_ROUTES } from '../data/roles_routes';
import { ApplicationMenu } from "../models/menu";
import { MenuItem } from "../models/menuItem";
import { RCCCEndpoints } from "../data/rccc-endpoints";
import { VersionToggle } from './versionToggle.service';

@Injectable({
  providedIn: "root"
})

export class SecurityService {
  Roles: Role[];
  RolesByMenu: RoleMenu[] = ROLE_ROUTES;
  public Menu: ApplicationMenu[] = null;
  public OnMenuChange: EventEmitter<ApplicationMenu[]> = new EventEmitter<ApplicationMenu[]>();

  constructor(private session: SessionStorageService, private cemexSessionService: SessionService, private versionToggle: VersionToggle) {

    let applications = this.session.get('applications');
    if (applications.length === 1) {
      this.Roles = <Role[]>applications[0]['roles'];
    }
    else {
      let result = applications.find((value, index, array) => value.applicationName === 'RCCC');
      if (result !== undefined) {
        this.Roles = <Role[]>result['roles'];
      }
    }

    this.cemexSessionService.menuApplicationItems.subscribe(x => {
      if (x.length !== 0) {
        let menu = <ApplicationMenu>x.filter(m => m.applicationTitle.includes('RCCC'))[0];
        this.CurrentMenu(menu);
      }
    }, (error: any) => {
      console.error(error);
    });
  }

  public GetRoutesByRole(roleName: string): RoleMenu {
    if (this.RolesByMenu !== null || this.RolesByMenu !== undefined) {
      let result: RoleMenu = this.RolesByMenu.find((value, index, array) => value.roleName === roleName);

      if (result !== undefined) {
        return result;
      }
    }

    return null;
  }
  public RoleHasAccesToRoute(route: string, roleName: string): boolean {
    let role = this.GetRoutesByRole(roleName);
    if (role !== null) {
      return role.routes.indexOf(route) !== -1;
    }
    return false;
  }

  public CurrentRoleHasAccessToRoute(currentRoute: string): boolean {
    for (let index = 0; index < this.Roles.length; index++) {
      const element: Role = this.Roles[index];
      let result: boolean = this.RoleHasAccesToRoute(currentRoute, element.roleCode);

      if (!result) {
        continue;
      }

      return true;
    }

    return false;
    //return true;
  } // end function current role has access to route

  CurrentMenu(menu: ApplicationMenu): void {

    let rcc = new ApplicationMenu();
    let fleetRestrictions = new ApplicationMenu();
    let generalConf = new ApplicationMenu();
    let contingencies = new ApplicationMenu();
    let country: string = sessionStorage.getItem('country');

    if (menu !== null) {
      menu.menu.menuItems.forEach((menuItem: MenuItem) => {
        let hasAccess = this.CurrentRoleHasAccessToRoute(`/app${menuItem.menuEndpoint}`);

        if (hasAccess) {
          let endpoints = RCCCEndpoints.filter(e => e.endpoint == menuItem.menuEndpoint);
          let endpoint = endpoints[0];
          if (typeof endpoint == 'undefined') {
            console.error('Not in rcccendpoint' + menuItem.menuEndpoint);
            return;
          } // end if undefined
          menuItem.menuTitle = endpoint.translationKey;

          if (this.IsFleet(menuItem.menuEndpoint)) {
            if (menuItem.menuEndpoint == '/rccc/flco/fleet-coverage' && country != 'MX') {
              console.warn('Coverage only for country MX');
            } else {
              fleetRestrictions.menu.menuItems.push(menuItem);
            } // end if coverage & colombia
          } else if (this.IsGeneralConfig(menuItem.menuEndpoint)) {
            generalConf.menu.menuItems.push(menuItem);
          } else if (this.IsContingencies(menuItem.menuEndpoint)) {
            contingencies.menu.menuItems.push(menuItem);
          } else {
            rcc.menu.menuItems.push(menuItem);
          }
        }
      });
    }

    generalConf.menu.menuItems.push({
      menuEndpoint: "app/settings/language",
      menuId: 5516,
      menuTitle: "language"
    }); // end menuItems push

    //this.customMenuItems[2].menu.menuItems.push(<any>menuItem);
    this.Menu = [];
    if (rcc.menu.menuItems.length > 0) {
      rcc.applicationIcon = menu.applicationIcon;
      rcc.applicationUrl = menu.applicationUrl;
      rcc.applicationTitle = 'rccc.landing_page.modules.rccc_short_title';
      this.Menu.push(rcc);
    } // end if has menuItems length

    var areFleet = false;
    if (fleetRestrictions.menu.menuItems.length > 0 && this.versionToggle.isFleetEnabled()) {
      fleetRestrictions.applicationIcon = `${menu.applicationIcon}-flco`;
      fleetRestrictions.applicationUrl = fleetRestrictions.menu.menuEndpoint = `${menu.applicationUrl}/flco`;
      fleetRestrictions.applicationTitle = 'rccc.menues.fleet_constraints';
      this.Menu.push(fleetRestrictions);
      areFleet = true;
    } // end if has menuItems length

    if (this.isViewOnly() && !areFleet && this.versionToggle.isFleetEnabled()) {
      fleetRestrictions.applicationIcon = `${menu.applicationIcon}-flco`;
      fleetRestrictions.applicationUrl = fleetRestrictions.menu.menuEndpoint = `${menu.applicationUrl}/flco`;
      fleetRestrictions.applicationTitle = 'rccc.menues.fleet_constraints';
      this.Menu.push(fleetRestrictions);
    }

    if (generalConf.menu.menuItems.length > 0) {
      generalConf.applicationIcon = `${menu.applicationIcon}-grco`;
      generalConf.applicationUrl = generalConf.menu.menuEndpoint = `${menu.applicationUrl}/grco`;
      generalConf.applicationTitle = 'rccc.menues.general_configurations';
      this.Menu.push(generalConf);
    } // end if has menuItems length

    this.OnMenuChange.emit(this.Menu);
  }

  IsRCC(route: string): boolean {
    return this.HasPartInRoute(route, 'rccc');
  }

  IsFleet(route: string): boolean {
    return this.HasPartInRoute(route, '/flco/');
  }

  IsGeneralConfig(route: string): boolean {
    return (this.HasPartInRoute(route, '/grco/') || this.HasPartInRoute(route, '/settings/'));
  }

  IsContingencies(route: string): boolean {
    return this.HasPartInRoute(route, '/cons/');
  }

  HasPartInRoute(route: string, part: string): boolean {
    return route.indexOf(part) !== -1;
  }

  isViewOnly(): boolean {
    let result: boolean = false;
    let apps: any[] = JSON.parse(sessionStorage.getItem("applications"));
    let roles: any[] = apps.filter(a => a.applicationName == 'RCCC')[0].roles;
    if (roles.length == 1 && roles[0].roleCode == 'SECM_RCCC_VIEW') {
      result = true;
    } // end if role is view
    return result;
  } // end function IsViewOnly

  getRole(): string {
    let apps: any[] = JSON.parse(sessionStorage.getItem("applications"));
    let roles: any[] = apps.filter(a => a.applicationName == 'RCCC')[0].roles;

    if (roles.length > 1) {
      return "POWER USER";
    } // end if > 1

    if (roles.length == 1) {
      return roles[0].roleCode;
    } // end if role is view

    return "undefined";
  } // end getRole
}