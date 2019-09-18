import { Component } from '@angular/core';
import { SessionService } from '@cemex-core/angular-services-v7';
import { Observable } from 'rxjs';
import { TranslationService } from '@cemex-core/angular-localization-v7';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public header = 'UMD Demo';
  public isRtl = false;
  public validateTempPassword = false;

  private myMethod = new Observable<any>(x => {
    console.log('deleting my_session_storage:', sessionStorage.getItem('my_session_storage'));
    sessionStorage.removeItem('my_session_storage');
  });

  constructor(sessionService: SessionService, public translationService: TranslationService) {
    sessionService.setBeforeLogout(this.myMethod);
  }

  public randomString(inputString: string): string {
    return 'lala';
  }
}
