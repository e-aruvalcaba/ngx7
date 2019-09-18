import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptedHttp extends HttpClient {
  public get(url: string, options: any): Observable<any> {
    if (url.indexOf('/translate/translate/user-provisioning/') > -1) {
      const langISO = url.slice(-5);
      langISO.slice(-1);
      // tslint:disable-next-line:max-line-length
      url = 'https://uscldcnxwaadmq01.azurewebsites.net/api/Translation/translate/user-provisioning/' + langISO;
    } else if (url.indexOf('/translate/getLanguages') > -1) {
      url = 'https://uscldcnxwaadmq01.azurewebsites.net/api/Translation/getLanguages';
    }

    return super.get(url, this.getRequestOptionArgs(options));
  }

  private getRequestOptionArgs(options?: any): any {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');

    return options;
  }
}
