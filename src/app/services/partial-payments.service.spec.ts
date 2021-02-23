import { TestBed } from '@angular/core/testing';

import { PartialPaymentsService } from './partial-payments.service';

describe('PartialPaymentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartialPaymentsService = TestBed.get(PartialPaymentsService);
    expect(service).toBeTruthy();
  });
});
