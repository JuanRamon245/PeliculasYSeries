import { TestBed } from '@angular/core/testing';

import { GenerosFirebaseService } from './generos-firebase.service';

describe('GenerosFirebaseService', () => {
  let service: GenerosFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerosFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
