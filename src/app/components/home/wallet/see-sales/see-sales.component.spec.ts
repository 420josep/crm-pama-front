import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeSalesComponent } from './see-sales.component';

describe('SeeSalesComponent', () => {
  let component: SeeSalesComponent;
  let fixture: ComponentFixture<SeeSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
