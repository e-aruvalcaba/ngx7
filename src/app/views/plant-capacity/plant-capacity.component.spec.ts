import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantCapacityComponent } from './plant-capacity.component';

describe('PlantCapacityComponent', () => {
  let component: PlantCapacityComponent;
  let fixture: ComponentFixture<PlantCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
