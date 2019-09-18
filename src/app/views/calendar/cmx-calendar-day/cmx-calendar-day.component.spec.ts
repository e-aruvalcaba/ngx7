import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmxCalendarDayComponent } from './cmx-calendar-day.component';

describe('CmxCalendarDayComponent', () => {
  let component: CmxCalendarDayComponent;
  let fixture: ComponentFixture<CmxCalendarDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmxCalendarDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmxCalendarDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
