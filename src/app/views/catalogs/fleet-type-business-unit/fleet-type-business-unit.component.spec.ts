import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetTypeBusinessUnitComponent } from './fleet-type-business-unit.component';

describe('FleetTypeBusinessUnitComponent', () => {
  let component: FleetTypeBusinessUnitComponent;
  let fixture: ComponentFixture<FleetTypeBusinessUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetTypeBusinessUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetTypeBusinessUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
