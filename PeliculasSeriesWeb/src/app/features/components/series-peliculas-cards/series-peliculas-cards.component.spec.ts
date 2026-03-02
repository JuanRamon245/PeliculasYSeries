import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesPeliculasCardsComponent } from './series-peliculas-cards.component';

describe('SeriesPeliculasCardsComponent', () => {
  let component: SeriesPeliculasCardsComponent;
  let fixture: ComponentFixture<SeriesPeliculasCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesPeliculasCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesPeliculasCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
