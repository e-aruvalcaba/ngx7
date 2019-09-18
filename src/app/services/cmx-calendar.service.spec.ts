import { TestBed } from '@angular/core/testing';

import { CmxCalendarService } from './cmx-calendar.service';

describe('CmxCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmxCalendarService = TestBed.get(CmxCalendarService);
    expect(service).toBeTruthy();
  });
});
