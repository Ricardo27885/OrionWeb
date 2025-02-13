import { TestBed } from '@angular/core/testing';

import { KekosService } from './kekos.service';

describe('KekosService', () => {
  let service: KekosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KekosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
