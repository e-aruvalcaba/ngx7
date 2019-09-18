import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmxCalendarComponent } from './cmx-calendar.component';

describe('CmxCalendarComponent', () => {
  let component: CmxCalendarComponent;
  let fixture: ComponentFixture<CmxCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmxCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmxCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
