import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    { path:'', component : AppComponent },
    { path:'settings', component : SettingsComponent }
];
