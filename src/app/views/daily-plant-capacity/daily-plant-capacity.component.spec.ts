import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlantCapacityComponent } from './daily-plant-capacity.component';

describe('DailyPlantCapacityComponent', () => {
  let component: DailyPlantCapacityComponent;
  let fixture: ComponentFixture<DailyPlantCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPlantCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPlantCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
