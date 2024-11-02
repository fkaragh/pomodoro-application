import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsComponent } from "./settings/settings.component";
import { TimerComponent } from './timer/timer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SettingsComponent, TimerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pomodoro';

}
