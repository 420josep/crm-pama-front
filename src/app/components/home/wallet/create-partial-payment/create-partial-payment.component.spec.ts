import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePartialPaymentComponent } from './create-partial-payment.component';

describe('CreatePartialPaymentComponent', () => {
  let component: CreatePartialPaymentComponent;
  let fixture: ComponentFixture<CreatePartialPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePartialPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePartialPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
