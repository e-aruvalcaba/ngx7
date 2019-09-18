import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmxCalendarWeekComponent } from './cmx-calendar-week.component';

describe('CmxCalendarWeekComponent', () => {
  let component: CmxCalendarWeekComponent;
  let fixture: ComponentFixture<CmxCalendarWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmxCalendarWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmxCalendarWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
