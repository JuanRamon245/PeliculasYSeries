import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFiltersComponent } from './menu-filters.component';

describe('MenuFiltersComponent', () => {
  let component: MenuFiltersComponent;
  let fixture: ComponentFixture<MenuFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
