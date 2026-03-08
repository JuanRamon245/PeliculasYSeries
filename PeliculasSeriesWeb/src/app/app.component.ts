import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoviesComponent } from "./features/movies/movies.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MoviesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PeliculasSeriesWeb';
}
