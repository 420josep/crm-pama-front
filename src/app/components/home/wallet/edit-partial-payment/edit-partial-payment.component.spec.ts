import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartialPaymentComponent } from './edit-partial-payment.component';

describe('EditPartialPaymentComponent', () => {
  let component: EditPartialPaymentComponent;
  let fixture: ComponentFixture<EditPartialPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPartialPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartialPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
