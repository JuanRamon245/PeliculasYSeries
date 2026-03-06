import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShowGendersComponent } from "./features/modals/show-genders/show-genders.component";
import { CreateUpdateGendersComponent } from "./features/modals/create-update-genders/create-update-genders.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShowGendersComponent, CreateUpdateGendersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PeliculasSeriesWeb';
}
