import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePartialPaymentForSaleComponent } from './create-partial-payment-for-sale.component';

describe('CreatePartialPaymentForSaleComponent', () => {
  let component: CreatePartialPaymentForSaleComponent;
  let fixture: ComponentFixture<CreatePartialPaymentForSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePartialPaymentForSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePartialPaymentForSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
