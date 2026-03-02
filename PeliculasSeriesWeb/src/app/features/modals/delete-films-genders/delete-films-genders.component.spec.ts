import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFilmsGendersComponent } from './delete-films-genders.component';

describe('DeleteFilmsGendersComponent', () => {
  let component: DeleteFilmsGendersComponent;
  let fixture: ComponentFixture<DeleteFilmsGendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFilmsGendersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFilmsGendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
