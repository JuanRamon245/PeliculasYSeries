import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateGendersComponent } from './create-update-genders.component';

describe('CreateUpdateGendersComponent', () => {
  let component: CreateUpdateGendersComponent;
  let fixture: ComponentFixture<CreateUpdateGendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateGendersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateGendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
