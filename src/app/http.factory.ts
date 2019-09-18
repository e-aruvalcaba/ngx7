import { InterceptedHttp } from './http.interceptor';
import { HttpClient, HttpHandler } from '@angular/common/http';

export function httpFactory(httpHandler: HttpHandler): HttpClient {
  return new InterceptedHttp(httpHandler);
}
