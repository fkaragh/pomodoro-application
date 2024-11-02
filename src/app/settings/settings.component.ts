import { Component, OnInit } from '@angular/core';
import { TimeSettingsService } from './time-settings.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  timeSettings: any; 
  isPopupOpen: boolean = false;
  selectedTime: number = 0;
  selectedKey: string = '';
  timeOptions: number[] = []; // Array to hold time options from 5 to 120
  longBreakOptions: number[] = []; // Array to hold Long Break After options from 1 to 16

  constructor(private timeSettingsService: TimeSettingsService, private router: Router) {
    this.timeSettings = timeSettingsService.getTimeSettings();
  }

  ngOnInit(): void {
    this.generateTimeOptions();
    this.generateLongBreakOptions(); // Yeni seçenekleri üret
  }

  // Generate time options from 5 to 120 in increments of 5
  generateTimeOptions() {
    for (let i = 5; i <= 120; i += 5) {
      this.timeOptions.push(i);
    }
  }

  // Generate Long Break After options from 1 to 16
  generateLongBreakOptions() {
    for (let i = 1; i <= 6; i++) {
      this.longBreakOptions.push(i);
    }
  }

  handleColorPopup(){
    //
  }

  openPopup(key: string) {
    this.selectedKey = key;
    this.selectedTime = this.timeSettings[key];
    this.isPopupOpen = true;
  }

  increment() {
    if (this.selectedKey === 'longBreakAfter') {
      if (this.selectedTime < 6) {
        this.selectedTime += 1;
      }
    } else {
      if (this.selectedTime < 120) {
        this.selectedTime += 5;
      }
    }
  }

  decrement() {
    if (this.selectedKey === 'longBreakAfter') {
      if (this.selectedTime > 1) {
        this.selectedTime -= 1;
      }
    } else {
      if (this.selectedTime > 5) {
        this.selectedTime -= 5;
      }
    }
  }

  confirmSelection() {
    this.timeSettings[this.selectedKey] = this.selectedTime; // Güncelleme yap
    this.isPopupOpen = false; // Pop-up'ı kapat
  }

  updateCheckbox(key: string, event: Event) {
    const checkbox = event.target as HTMLInputElement; // 'EventTarget' türünü kesinleştir
    this.timeSettings[key] = checkbox.checked; // Checkbox durumunu güncelle
  }

  saveSettings() {
    this.timeSettingsService.updateTimeSettings(this.timeSettings); // Güncellenmiş ayarları servise gönder
    this.router.navigate(['/'], {
      replaceUrl: true,
    });
  }
}
