import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFleetCapacityComponent } from './daily-fleet-capacity.component';

describe('DailyFleetCapacityComponent', () => {
  let component: DailyFleetCapacityComponent;
  let fixture: ComponentFixture<DailyFleetCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyFleetCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyFleetCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
