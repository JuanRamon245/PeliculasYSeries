import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateFilmsComponent } from './create-update-films.component';

describe('CreateUpdateFilmsComponent', () => {
  let component: CreateUpdateFilmsComponent;
  let fixture: ComponentFixture<CreateUpdateFilmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateFilmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateFilmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
