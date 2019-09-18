import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesUnitSettingsComponent } from './bussines-unit-settings.component';

describe('BussinesUnitSettingsComponent', () => {
  let component: BussinesUnitSettingsComponent;
  let fixture: ComponentFixture<BussinesUnitSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinesUnitSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinesUnitSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
