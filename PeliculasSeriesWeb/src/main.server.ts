import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Envolvemos la llamada en una función anónima "() =>"
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;