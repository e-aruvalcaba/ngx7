import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferEnablementAdminComponent } from './offer-enablement-admin.component';

describe('OfferEnablementAdminComponent', () => {
  let component: OfferEnablementAdminComponent;
  let fixture: ComponentFixture<OfferEnablementAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferEnablementAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferEnablementAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
