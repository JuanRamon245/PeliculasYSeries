import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGendersComponent } from './show-genders.component';

describe('ShowGendersComponent', () => {
  let component: ShowGendersComponent;
  let fixture: ComponentFixture<ShowGendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowGendersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowGendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
