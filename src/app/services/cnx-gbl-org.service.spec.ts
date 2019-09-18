import { TestBed } from '@angular/core/testing';

import { CnxGblOrgService } from './cnx-gbl-org.service';

describe('CnxGblOrgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CnxGblOrgService = TestBed.get(CnxGblOrgService);
    expect(service).toBeTruthy();
  });
});
