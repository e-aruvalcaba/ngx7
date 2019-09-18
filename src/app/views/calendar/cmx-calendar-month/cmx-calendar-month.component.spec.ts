import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmxCalendarMonthComponent } from './cmx-calendar-month.component';

describe('CmxCalendarMonthComponent', () => {
  let component: CmxCalendarMonthComponent;
  let fixture: ComponentFixture<CmxCalendarMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmxCalendarMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmxCalendarMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
