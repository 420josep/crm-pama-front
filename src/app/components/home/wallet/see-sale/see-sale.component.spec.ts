import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeSaleComponent } from './see-sale.component';

describe('SeeSaleComponent', () => {
  let component: SeeSaleComponent;
  let fixture: ComponentFixture<SeeSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
