import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCoverageComponent } from './fleet-coverage.component';

describe('FleetCoverageComponent', () => {
  let component: FleetCoverageComponent;
  let fixture: ComponentFixture<FleetCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
