import { Injectable } from '@angular/core';

interface TimeSettings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakAfter: number;
  isAutoFocusOn: boolean;
  isAutoBreakOn: boolean;
  isAlarmSoundOn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TimeSettingsService {
  private timeSettings : TimeSettings = {
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 20,
    longBreakAfter: 4,
    isAutoFocusOn: false,
    isAutoBreakOn: false,
    isAlarmSoundOn: false,
  };
  

  getTimeSettings(): TimeSettings {
    return this.timeSettings;
  }

  constructor() {
    this.loadSettings();
  }

  updateTimeSettings(newSettings: Partial<TimeSettings>): void {
    this.timeSettings = { ...this.timeSettings, ...newSettings };
    this.saveSettings(); // Güncelledikten sonra kaydet
  }

  //local de ayar kayitli ise onu yukle
  loadSettings(): void {
    const storedSettings = localStorage.getItem('timeSettings');
    if (storedSettings) {
        this.timeSettings = JSON.parse(storedSettings);
    } else{
      //burasi cok mantikli gelmedi guncellemem gerekecek
      this.timeSettings = this.getTimeSettings();
    }
  }

  //local e ayarlari kayitla
  saveSettings(): void {
    localStorage.setItem('timeSettings', JSON.stringify(this.timeSettings));
  }
}
