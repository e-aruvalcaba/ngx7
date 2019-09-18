import { TestBed } from '@angular/core/testing';

import { IsSecureGuardService } from './is-secure-guard.service';

describe('IsSecureGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsSecureGuardService = TestBed.get(IsSecureGuardService);
    expect(service).toBeTruthy();
  });
});
