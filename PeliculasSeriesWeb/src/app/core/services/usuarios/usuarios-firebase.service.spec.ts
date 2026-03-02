import { TestBed } from '@angular/core/testing';

import { UsuariosFirebaseService } from './usuarios-firebase.service';

describe('UsuariosFirebaseService', () => {
  let service: UsuariosFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
