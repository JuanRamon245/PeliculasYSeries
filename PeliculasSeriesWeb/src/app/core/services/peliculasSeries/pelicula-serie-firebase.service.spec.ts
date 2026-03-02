import { TestBed } from '@angular/core/testing';

import { PeliculaSerieFirebaseService } from './pelicula-serie-firebase.service';

describe('PeliculaSerieFirebaseService', () => {
  let service: PeliculaSerieFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeliculaSerieFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
