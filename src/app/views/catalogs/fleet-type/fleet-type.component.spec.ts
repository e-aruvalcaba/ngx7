import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetTypeComponent } from './fleet-type.component';

describe('FleetTypeComponent', () => {
  let component: FleetTypeComponent;
  let fixture: ComponentFixture<FleetTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
