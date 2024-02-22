import { TestBed } from '@angular/core/testing';

import { BpService } from './bp.service';

describe('BpService', () => {
  let service: BpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
