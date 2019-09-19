import { Inject, Injectable, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { Broadcaster } from '@cemex-core/events-v7';

@Injectable()
export class FeatureToggleService {
  public static featureList: Map<string, IFeatureItem> = new Map<string, IFeatureItem>();
  public static language = '';

  // Must be set on path constants

  public static PRODUCT_PATH = "OrderProductCat_App";//'PRODUCT_PATH';
  public static ENVIRONMENT = "development";//'PRODUCT_PATH';
  public static USE_LOCAL_MANIFEST = 'USE_LOCAL_MANIFEST';

  /**
   * gets all features
   */
  private productPath = '';
  private productEnvironment = '';
  public static all(): Map<string, IFeatureItem> {
    return this.featureList;
  }
  constructor(
    private eventBroadcaster: Broadcaster,
    private http: Http,
    @Inject(FeatureToggleService.PRODUCT_PATH)
    @Optional()
    private _productPath: string,
    @Inject(FeatureToggleService.ENVIRONMENT)
    @Optional()
    private _productEnvironment: string,
    @Inject(FeatureToggleService.USE_LOCAL_MANIFEST)
    @Optional()
    private localManifest: boolean
  ) {
    this.productPath = _productPath || '/';
    this.productEnvironment = _productEnvironment || 'development';
    this.getFeatureList(this.localManifest || false);
  }
  /**
   * this method returns either true or false if the list of the features
   * requested is enabled in this environment and for this user
   * @param featureId featureId
   */
  public feature(
    featureId: string | string[],
    releaseVersion?: string,
    featureVersion?: string,
    hostName?: string
  ): boolean {
    if (typeof featureId === 'string') {
      return this.coreValidator(featureId, releaseVersion, featureVersion, hostName);
    } else {
      featureId.forEach(singleFeature => {
        if (!this.coreValidator(singleFeature, releaseVersion, featureVersion, hostName)) {
          return false;
        }
      });
    }
    return true;
  }

  /**
   * this method returns all list of features
   * @param featureId featureId
   */
  public getAll(): Map<string, IFeatureItem> {
    return FeatureToggleService.featureList;
  }
  /**
   * this method allows to load the feature list from the file
   * @param loadFromLocalList loadFromLocalList
   */
  public getFeatureList(loadFromLocalList: boolean): void {
    // if the loadfromlocallist is true, then load the local-feature.json file
    if (loadFromLocalList) {
      this.http
        .get(this.productPath + 'vendor/local-feature.json')
        .toPromise()
        .then(response => this.populateFeatures(response.json()))
        .catch(this.handleError);
    } else {
      // if the API is ready then switch is this one
      this.http
        .get('/feature/api' + this.productPath)
        .toPromise()
        .then(response => this.populateFeatures(response.json()))
        .catch(this.handleError);
    }
  }

  private coreValidator(
    featureId: string,
    releaseVersion?: string,
    featureVersion?: string,
    hostName?: string
  ): boolean {
    // todo smaller refactor
    const localFind: IFeatureItem = FeatureToggleService.featureList.get(featureId);
    if (localFind === undefined) {
      return false;
    }
    // if it is found then verify against the country
    if (localFind.country !== null && localFind.country !== undefined) {
      // we can take the country from the session storage
      if (window.sessionStorage.getItem('country').indexOf(localFind.country) === -1) {
        return false;
      }
    }
    if (localFind.role !== null && localFind.role !== undefined) {
      let isRoleAssigned = false;
      const appsAvailable = JSON.parse(window.sessionStorage.getItem('applications'));
      appsAvailable.forEach((app: IApplication) => {
        app.roles.forEach(role => {
          if ((role as IRole).roleCode === localFind.role) {
            isRoleAssigned = true;
          }
        });
      });
      if (!isRoleAssigned) {
        return false;
      }
    }
    if (localFind.role_match !== null && localFind.role_match !== undefined) {
      let rolesAssigned = 0;
      const appsAvailable = JSON.parse(window.sessionStorage.getItem('applications'));
      appsAvailable.forEach((app: IApplication) => {
        app.roles.forEach(role => {
          if (localFind.role_match.indexOf((role as IRole).roleCode) !== -1) {
            rolesAssigned = rolesAssigned + 1;
          }
        });
      });
      if (rolesAssigned !== localFind.role_match.split(',').length) {
        return false;
      }
    }
    if (localFind.role_any !== null && localFind.role_any !== undefined) {
      let rolesAssigned = 0;
      const appsAvailable = JSON.parse(window.sessionStorage.getItem('applications'));
      appsAvailable.forEach((app: IApplication) => {
        app.roles.forEach(role => {
          if (localFind.role_any.indexOf((role as IRole).roleCode) !== -1) {
            rolesAssigned = rolesAssigned + 1;
          }
        });
      });
      if (rolesAssigned === 0) {
        return false;
      }
    }
    if (localFind.environment !== null && localFind.environment !== undefined) {
      // verify the injection of the environment
      if (localFind.environment !== this.productEnvironment) {
        return false;
      }
    }
    if (localFind.release_version !== null && localFind.release_version !== undefined) {
      // verify the injection of the environment
      if (localFind.release_version !== releaseVersion) {
        return false;
      }
    }
    if (localFind.feature_version !== null && localFind.feature_version !== undefined) {
      // verify the injection of the environment
      if (localFind.feature_version !== featureVersion) {
        return false;
      }
    }
    if (localFind.host_name !== null && localFind.host_name !== undefined) {
      // verify the injection of the environment
      if (localFind.host_name !== hostName) {
        return false;
      }
    }
    return true;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private populateFeatures(result) {
    for (const item of Object.keys(result)) {
      FeatureToggleService.featureList.set((result[item] as IFeatureItem).feature, result[item]);
    }
    // this.eventBroadcaster.broadcast(Broadcaster.DCM_LANGUAGE_FETCHED, TranslationService.language);
    // this.onChange(result);
  }
}

export interface IFeatureItem {
  feature: string;
  option: string | number;
  environment: string;
  role: string;
  country: string;
  release_version: string;
  feature_version: string;
  host_name: string;
  role_match: string;
  role_any: string;
}
export interface IApplication {
  applicationCode: string;
  applicationId: number;
  roles: IRole[];
}

export interface IRole {
  roleCode: string;
  roleId: number;
}
